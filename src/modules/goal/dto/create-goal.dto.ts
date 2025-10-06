import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator'

export class CreateGoalDto {
  @ApiProperty({
    example: '10/2025',
    description: 'Tháng mục tiêu theo định dạng MM/YYYY',
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'month phải theo định dạng MM/YYYY',
  })
  @IsNotEmpty()
  month: string

  @ApiProperty({
    example: 50,
    description: 'Mục tiêu giảm CO₂ (kg) trong tháng',
  })
  @IsNumber()
  @Min(0, { message: 'target_co2 phải >= 0' })
  @IsNotEmpty()
  target_co2: number

  @ApiPropertyOptional({
    example: 32.5,
    description: 'Lượng CO₂ đã giảm được (kg) trong tháng',
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'achieved_co2 phải >= 0' })
  achieved_co2?: number

  @ApiPropertyOptional({
    example: 65,
    description: 'Phần trăm hoàn thành mục tiêu (%)',
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'progress_percent phải >= 0' })
  progress_percent?: number
}
