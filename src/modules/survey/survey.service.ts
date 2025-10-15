import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateSurveyDto } from './dto/create-survey.dto'
import { Survey, SURVEY_MODEL } from './schemas/survey.schema'

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(SURVEY_MODEL)
    private readonly surveyModel: Model<Survey>
  ) {}

  async create(dto: CreateSurveyDto, client_id: string): Promise<Survey> {
    try {
      const survey = new this.surveyModel({
        ...dto,
        client_id,
        createdAt: new Date(),
      })
      const savedSurvey = await survey.save()
      return savedSurvey
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Không thể tạo khảo sát. Vui lòng thử lại sau.')
    }
  }

  async countByRating(): Promise<Record<number, number>> {
    try {
      const result = await this.surveyModel.aggregate([
        {
          $match: {
            is_deleted: { $ne: true },
            overall_rating: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$overall_rating',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      const stats: Record<number, number> = {}
      for (const item of result) {
        stats[item._id] = item.count
      }
      for (let i = 1; i <= 5; i++) {
        if (!stats[i]) stats[i] = 0
      }
      return stats
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Không thể thống kê rating.')
    }
  }
}
