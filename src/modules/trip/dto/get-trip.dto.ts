import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from 'src/shares/dtos/pagination.dto'
import { Trim } from 'src/shares/decorators/transforms.decorator'

export class GetTripDto extends PaginationDto {
  @ApiProperty({
    description: 'Ngày bắt đầu (định dạng YYYY-MM-DD)',
    example: '2025-10-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'start_date phải là chuỗi ngày hợp lệ dạng YYYY-MM-DD' })
  start_date?: string

  @ApiProperty({
    description: 'Ngày kết thúc (định dạng YYYY-MM-DD)',
    example: '2025-10-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'end_date phải là chuỗi ngày hợp lệ dạng YYYY-MM-DD' })
  end_date?: string
}
