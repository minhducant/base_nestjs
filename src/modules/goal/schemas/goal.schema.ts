import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type GoalDocument = Goal & Document

export const GOAL_MODEL = 'goal'

@Schema({ timestamps: true, collection: GOAL_MODEL })
export class Goal {
  @ApiProperty({
    example: '671b03c9b8d9e5001246fa01',
    description: 'ID của client (người dùng)',
    type: String,
  })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true })
  client_id: MongooseSchema.Types.ObjectId

  @ApiProperty({
    example: '2025-10',
    description: 'Tháng mục tiêu theo định dạng YYYY-MM',
  })
  @Prop({ required: true, type: String })
  month: string

  @ApiProperty({
    example: 50,
    description: 'Mục tiêu giảm CO₂ (kg) trong tháng',
    type: Number,
  })
  @Prop({ required: true, type: Number })
  target_co2: number

  @ApiProperty({
    example: 32.5,
    description: 'Lượng CO₂ đã giảm được (kg) trong tháng',
    type: Number,
    default: 0,
  })
  @Prop({ type: Number, default: 0 })
  achieved_co2?: number

  @ApiProperty({
    example: 65,
    description: 'Phần trăm hoàn thành mục tiêu (%)',
    type: Number,
    default: 0,
  })
  @Prop({ type: Number, default: 0 })
  progress_percent?: number
}

export const GoalSchema = SchemaFactory.createForClass(Goal)
