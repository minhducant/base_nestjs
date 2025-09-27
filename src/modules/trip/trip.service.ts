import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'

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

  async findByClient(clientId: string): Promise<TripItem[]> {
    return this.tripModel.find({ client_id: new mongoose.Types.ObjectId(clientId) }).exec()
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
}
