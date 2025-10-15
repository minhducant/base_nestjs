import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Exclude } from 'class-transformer'

export const SURVEY_MODEL = 'surveys'

@Schema({
  timestamps: true,
})
export class Survey extends Document {
  // Người dùng gửi khảo sát
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false })
  client_id?: MongooseSchema.Types.ObjectId

  // Thời lượng sử dụng app
  @Prop({ type: String, required: false })
  used_duration?: string

  // Tần suất sử dụng
  @Prop({ type: String, required: false })
  frequency_usage?: string

  // UX: dễ sử dụng
  @Prop({ type: String, required: false })
  ux_easy?: string

  // Gặp lỗi hay không
  @Prop({ type: String, required: false })
  encountered_issues?: string

  // Hài lòng về tốc độ
  @Prop({ type: String, required: false })
  speed_satisfaction?: string

  // Đầy đủ chức năng?
  @Prop({ type: String, required: false })
  features_enough?: string

  // Tính năng thường dùng
  @Prop({ type: String, required: false })
  most_used_feature?: string

  // Có tính năng chưa hiệu quả?
  @Prop({ type: String, required: false })
  ineffective_feature_exists?: string

  // Chi tiết tính năng chưa hiệu quả
  @Prop({ type: String, required: false })
  ineffective_feature_detail?: string

  // Mong muốn thêm tính năng gì
  @Prop({ type: String, required: false })
  desired_features?: string

  // Đánh giá giao diện
  @Prop({ type: String, required: false })
  ui_design_rating?: string

  // Màu sắc & bố cục hỗ trợ thao tác
  @Prop({ type: String, required: false })
  ui_colors_help?: string

  // Đánh giá tổng thể (1–5)
  @Prop({ type: Number, min: 1, max: 5, required: false })
  overall_rating?: number

  // Có giới thiệu ứng dụng không
  @Prop({ type: String, required: false })
  recommend?: string

  // Thích nhất điều gì
  @Prop({ type: String, required: false })
  liked_most?: string

  // Muốn cải thiện điều gì
  @Prop({ type: String, required: false })
  want_improve?: string

  // Góp ý khác
  @Prop({ type: String, required: false })
  suggestions?: string

  // Cờ xóa logic (ẩn khỏi API)
  @Prop({ type: Boolean, default: false })
  @Exclude()
  is_deleted?: boolean
}

export const SurveySchema = SchemaFactory.createForClass(Survey)
