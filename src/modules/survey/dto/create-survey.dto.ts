import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { IsOptional, IsMongoId, IsEnum, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator'

export class CreateSurveyDto {
  @ApiProperty({
    description: 'Thời lượng sử dụng ứng dụng',
    enum: ['less_than_week', '1_4_weeks', '1_3_months', 'more_than_3_months'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['less_than_week', '1_4_weeks', '1_3_months', 'more_than_3_months'])
  used_duration?: string

  @ApiProperty({
    description: 'Tần suất sử dụng ứng dụng',
    enum: ['daily', '2_3_per_week', 'once_week', 'less'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['daily', '2_3_per_week', 'once_week', 'less'])
  frequency_usage?: string

  @ApiProperty({
    description: 'Mức độ dễ sử dụng (UX)',
    enum: ['very_easy', 'easy', 'average', 'difficult', 'very_difficult'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['very_easy', 'easy', 'average', 'difficult', 'very_difficult'])
  ux_easy?: string

  @ApiProperty({
    description: 'Tần suất gặp lỗi hoặc sự cố',
    enum: ['frequently', 'occasionally', 'rarely', 'never'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['frequently', 'occasionally', 'rarely', 'never'])
  encountered_issues?: string

  @ApiProperty({
    description: 'Mức độ hài lòng về tốc độ xử lý',
    enum: ['very_satisfied', 'satisfied', 'neutral', 'dissatisfied'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied'])
  speed_satisfaction?: string

  @ApiProperty({
    description: 'Ứng dụng có đầy đủ chức năng không',
    enum: ['yes', 'almost', 'missing_few', 'missing_many'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'almost', 'missing_few', 'missing_many'])
  features_enough?: string

  @ApiProperty({ description: 'Tính năng sử dụng thường xuyên nhất', required: false })
  @IsOptional()
  @IsString()
  most_used_feature?: string

  @ApiProperty({
    description: 'Có tính năng chưa hiệu quả không',
    enum: ['yes', 'no'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'no'])
  ineffective_feature_exists?: string

  @ApiProperty({ description: 'Chi tiết tính năng chưa hiệu quả', required: false })
  @IsOptional()
  @IsString()
  ineffective_feature_detail?: string

  @ApiProperty({ description: 'Tính năng mong muốn bổ sung thêm', required: false })
  @IsOptional()
  @IsString()
  desired_features?: string

  @ApiProperty({
    description: 'Đánh giá thiết kế giao diện (UI)',
    enum: ['very_modern', 'clear', 'average', 'cluttered'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['very_modern', 'clear', 'average', 'cluttered'])
  ui_design_rating?: string

  @ApiProperty({
    description: 'Màu sắc, biểu tượng có hỗ trợ thao tác nhanh không',
    enum: ['yes', 'partly', 'no'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'partly', 'no'])
  ui_colors_help?: string

  @ApiProperty({
    description: 'Đánh giá tổng thể (1–5)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  overall_rating?: number

  @ApiProperty({
    description: 'Bạn có giới thiệu ứng dụng không',
    enum: ['yes', 'maybe', 'no'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'maybe', 'no'])
  recommend?: string

  @ApiProperty({ description: 'Điều thích nhất ở ứng dụng', required: false })
  @IsOptional()
  @IsString()
  liked_most?: string

  @ApiProperty({ description: 'Điều chưa hài lòng / muốn cải thiện', required: false })
  @IsOptional()
  @IsString()
  want_improve?: string

  @ApiProperty({ description: 'Góp ý khác (tùy chọn)', required: false })
  @IsOptional()
  @IsString()
  suggestions?: string

  @ApiProperty({ description: 'Cờ xóa mềm (ẩn khỏi danh sách)', required: false })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean
}
