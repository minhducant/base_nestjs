import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type TripItemDocument = TripItem & Document

export const TRIP_MODEL = 'trip'

@Schema({ timestamps: true, collection: TRIP_MODEL })
export class TripItem {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true })
  client_id: MongooseSchema.Types.ObjectId

  @ApiProperty({
    example: [
      [105.83416, 21.027763],
      [105.835, 21.028],
    ],
    description: 'Danh sách toạ độ [Kinh độ, Vĩ độ]',
    type: [[Number]],
  })
  @Prop({ type: [[Number]], required: false })
  coord?: number[][]

  @ApiProperty({
    example: [105.83416, 21.027763],
    description: '[Kinh độ, Vĩ độ]',
    type: [Number],
  })
  @Prop({ type: [Number], required: true })
  origin: number[]

  @ApiProperty({
    example: [105.83416, 21.027763],
    description: '[Kinh độ, Vĩ độ]',
    type: [Number],
  })
  @Prop({ type: [Number], required: true })
  destination: number[]

  @ApiProperty({
    example: [105.83416, 21.027763],
    description: '[Kinh độ, Vĩ độ]',
    type: [Number],
  })
  @Prop({ type: [Number], required: true })
  current_positon: number[]

  @ApiProperty({ example: 'Hà Nội', description: 'Tên địa điểm' })
  @Prop({ required: true })
  origin_text: string

  @ApiProperty({ example: 'Hà Nội', description: 'Tên địa điểm' })
  @Prop({ required: true })
  destination_text: string

  @ApiProperty({ example: '15.2 km', description: 'Quãng đường hiển thị', required: false })
  @Prop({ required: false })
  distance_text?: string

  @ApiProperty({ example: '30 phút', description: 'Thời gian hiển thị', required: false })
  @Prop({ required: false })
  duration_text?: string

  @ApiProperty({ example: '2025-09-24T08:00:00.000Z', description: 'Thời gian bắt đầu', required: false, type: String })
  @Prop()
  startedAt?: string

  @ApiProperty({ example: '2025-09-24T09:00:00.000Z', description: 'Thời gian kết thúc', required: false, type: String })
  @Prop()
  endedAt?: string

  @ApiProperty({ example: 2.5, description: 'Khối lượng CO2 (kg)', required: false, type: Number, default: 0 })
  @Prop({ default: 0 })
  co2?: number

  @ApiProperty({
    example: 2.8,
    description: 'Lượng CO2 ước tính (kg)',
    required: false,
    type: Number,
    default: 0,
  })
  @Prop({ default: 0 })
  co2_estimated?: number

  @ApiProperty({ example: 15.2, description: 'Quãng đường (km)', required: false, type: Number, default: 0 })
  @Prop()
  distance?: number

  @ApiProperty({ example: 1800, description: 'Thời gian di chuyển (giây)', required: false, type: Number, default: 0 })
  @Prop()
  duration?: number

  @ApiProperty({
    enum: ['car', 'motorbike', 'bus', 'bicycle', 'walk'],
    example: 'car',
    description: 'Phương tiện di chuyển',
  })
  @Prop({ required: true, enum: ['car', 'motorbike', 'bus', 'bicycle', 'walk', 'bike', 'truck'] })
  vehicle: 'car' | 'motorbike' | 'bus' | 'bicycle' | 'walk' | 'bike' | 'truck'

  @ApiProperty({
    enum: ['planned', 'ongoing', 'ended'],
    example: 'planned',
    description: 'Trạng thái chuyến đi',
  })
  @Prop({ required: true, enum: ['planned', 'ongoing', 'ended'], index: true, default: 'ongoing' })
  status: 'planned' | 'ongoing' | 'ended'
}

export const TripItemSchema = SchemaFactory.createForClass(TripItem)
