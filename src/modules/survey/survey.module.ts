import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SurveyService } from './survey.service'
import { SurveyController } from './survey.controller'
import { Survey, SurveySchema, SURVEY_MODEL } from './schemas/survey.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: SURVEY_MODEL, schema: SurveySchema }])],
  controllers: [SurveyController],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
