import { Get, Post, Body, Patch, Param, Delete, Query, Controller } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { Survey } from './schemas/survey.schema'
import { SurveyService } from './survey.service'
import { CreateSurveyDto } from './dto/create-survey.dto'
import { ClientAuth } from 'src/shares/decorators/http.decorators'
import { UserID } from 'src/shares/decorators/get-user-id.decorator'

@ApiTags('Survey')
@ApiBearerAuth()
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @ClientAuth()
  @ApiOperation({ summary: 'Tạo khảo sát người dùng (client gửi)' })
  async create(@Body() createSurveyDto: CreateSurveyDto, @UserID() client_id?: string): Promise<Survey> {
    return this.surveyService.create(createSurveyDto, client_id)
  }

  @Get('rating-stats')
  @ApiOperation({ summary: 'Thống kê số lượng khảo sát theo từng mức rating (1–5)' })
  async getRatingStats() {
    return await this.surveyService.countByRating()
  }
}
