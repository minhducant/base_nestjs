import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { CreateGoalDto } from './dto/create-goal.dto'
import { Goal, GoalDocument } from './schemas/goal.schema'

@Injectable()
export class GoalService {
  constructor(@InjectModel(Goal.name) private readonly goalModel: Model<GoalDocument>) {}

  async create(createGoalDto: CreateGoalDto, client_id: string): Promise<Goal> {
    const { month } = createGoalDto
    const existingGoal = await this.goalModel.findOne({
      client_id: new Types.ObjectId(client_id),
      month,
    })
    if (existingGoal) {
      existingGoal.target_co2 = createGoalDto.target_co2
      if (createGoalDto.achieved_co2 !== undefined) existingGoal.achieved_co2 = createGoalDto.achieved_co2
      if (createGoalDto.progress_percent !== undefined) existingGoal.progress_percent = createGoalDto.progress_percent
      return existingGoal.save()
    }
    const createdGoal = new this.goalModel({ ...createGoalDto, client_id: new Types.ObjectId(client_id) })
    return createdGoal.save()
  }

  async findGoal(client_id: string, month: string): Promise<Goal | null> {
    const query: any = {}
    if (client_id) {
      query['client_id'] = new Types.ObjectId(client_id)
    }
    const targetMonth = month || this.getCurrentMonth()
    query.month = targetMonth
    const [mm, yyyy] = targetMonth.split('/')
    const startDate = new Date(Number(yyyy), Number(mm) - 1, 1)
    const endDate = new Date(Number(yyyy), Number(mm), 1)
    const result = await this.goalModel
      .aggregate([
        {
          $match: {
            ...query,
          },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: 'trip',
            let: { clientId: '$client_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$client_id', '$$clientId'] }, { $gte: ['$createdAt', startDate] }, { $lt: ['$createdAt', endDate] }],
                  },
                },
              },
              { $project: { _id: 1, co2: 1, co2_estimated: 1, createdAt: 1 } },
            ],
            as: 'trip',
          },
        },
        {
          $addFields: {
            achieved_co2: {
              $round: [
                {
                  $sum: {
                    $map: {
                      input: '$trip',
                      as: 't',
                      in: {
                        $cond: {
                          if: {
                            $or: [{ $eq: ['$$t.co2', 0] }, { $eq: ['$$t.co2', null] }, { $not: ['$$t.co2'] }],
                          },
                          then: { $ifNull: ['$$t.co2_estimated', 0] },
                          else: '$$t.co2',
                        },
                      },
                    },
                  },
                },
                2,
              ],
            },
          },
        },
        {
          $project: {
            trip: 0,
          },
        },
      ])
      .exec()
    return result.length > 0 ? result[0] : null
  }

  async findOne(id: string): Promise<Goal> {
    const goal = await this.goalModel.findById(id).exec()
    if (!goal) {
      throw new NotFoundException(`Goal với id "${id}" không tồn tại`)
    }
    return goal
  }

  async update(id: string, updateGoalDto: CreateGoalDto): Promise<Goal> {
    const updatedGoal = await this.goalModel.findByIdAndUpdate(id, updateGoalDto, { new: true }).exec()
    if (!updatedGoal) {
      throw new NotFoundException(`Goal với id "${id}" không tồn tại`)
    }
    return updatedGoal
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedGoal = await this.goalModel.findByIdAndDelete(id).exec()
    if (!deletedGoal) {
      throw new NotFoundException(`Goal với id "${id}" không tồn tại`)
    }
    return { message: 'Xoá goal thành công' }
  }

  getCurrentMonth(): string {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return `${month}/${year}`
  }
}
