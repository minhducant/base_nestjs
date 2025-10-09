import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'

import { GetTripDto } from './dto/get-trip.dto'
import { ResPagingDto } from 'src/shares/dtos/pagination.dto'
import { TripItem, TripItemDocument } from './schemas/trip.schema'
@Injectable()
export class TripService {
  constructor(
    @InjectModel(TripItem.name)
    private readonly tripModel: Model<TripItemDocument>
  ) {}

  async create(clientId: string, data: Partial<TripItem>): Promise<TripItem> {
    const newTrip = new this.tripModel({
      ...data,
      client_id: new mongoose.Types.ObjectId(clientId),
    })
    return newTrip.save()
  }

  async findById(id: string): Promise<TripItem> {
    const trip = await this.tripModel.findById(id).exec()
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`)
    }
    return trip
  }

  async update(id: string, data: Partial<TripItem>): Promise<TripItem> {
    const updatedTrip = await this.tripModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec()
    if (!updatedTrip) {
      throw new NotFoundException(`Trip with id ${id} not found`)
    }
    return updatedTrip
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.tripModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Trip with id ${id} not found`)
    }
    return { deleted: true }
  }

  async findByClient(clientId: string, getTripDto: GetTripDto): Promise<ResPagingDto<any[]>> {
    const { page, limit } = getTripDto

    const query: any = {
      client_id: new mongoose.Types.ObjectId(clientId),
      status: 'ended',
    }

    const [result, total] = await Promise.all([
      this.tripModel
        .aggregate([
          {
            $match: {
              ...query,
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
          {
            $addFields: {
              dateKey: {
                $dateToString: { format: '%d/%m/%Y', date: '$createdAt' },
              },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $group: {
              _id: '$dateKey',
              data: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 0,
              title: '$_id',
              data: 1,
            },
          },
          {
            $sort: { title: -1 },
          },
        ])
        .exec(),
      this.tripModel.countDocuments(query),
    ])
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOngoingTripByClient(clientId: string): Promise<TripItem> {
    const trip = await this.tripModel
      .findOne({
        client_id: new mongoose.Types.ObjectId(clientId),
        status: 'ongoing',
      })
      .exec()
    if (!trip) {
      throw new NotFoundException(`No ongoing trip found for client ${clientId}`)
    }
    return trip
  }

  async getReport(clientId: string, getTripDto: GetTripDto): Promise<any> {
    const { start_date, end_date } = getTripDto
    const start = start_date ? new Date(`${start_date}T00:00:00.000Z`) : null
    const end = end_date ? new Date(`${end_date}T23:59:59.999Z`) : null
    const match = {
      client_id: new mongoose.Types.ObjectId(clientId),
      status: 'ended',
      createdAt: { $gte: start, $lte: end },
    }
    const vehicles = ['car', 'bus', 'bicycle', 'walk', 'airplane', 'train', 'bike', 'truck']
    const dailyPromise = this.tripModel
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            value: { $sum: '$co2_estimated' },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            value: { $round: ['$value', 2] },
          },
        },
        { $sort: { date: 1 } },
      ])
      .exec()
    const vehiclePromise = this.tripModel
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: '$vehicle',
            total_co2: { $sum: '$co2_estimated' },
          },
        },
        {
          $project: {
            _id: 0,
            vehicle: '$_id',
            total_co2: { $round: ['$total_co2', 2] },
          },
        },
      ])
      .exec()
    const [dailyData, vehicleData] = await Promise.all([dailyPromise, vehiclePromise])
    const vehicleResult: Record<string, number> = {}
    for (const v of vehicles) {
      const found = vehicleData.find((d) => d.vehicle === v)
      vehicleResult[v] = found ? found.total_co2 : 0
    }
    const total = Object.values(vehicleResult).reduce((a, b) => a + b, 0)
    return {
      daily: dailyData,
      by_vehicle: {
        total: Math.round(total * 100) / 100,
        vehicles: vehicleResult,
      },
    }
  }
}
