import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString,IsDate } from 'class-validator'
import { ObjectId } from 'mongoose'
import { Trim } from 'src/shares/decorators/transforms.decorator'
import { PaginationDto } from 'src/shares/dtos/pagination.dto'

export class GetClientsDto extends PaginationDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  // @IsMongoId()
  // @Trim()
  readonly id?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly cust_id?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly code?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payment_code?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly pancake?: string

  @ApiProperty({ required: false })
  @IsOptional()
  // @IsEmail()
  readonly email?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly role?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  start_date?: Date
  

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  end_date?: Date
}

export class GetClientByPhoneOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  phone: string
}

export class GetPaymentByClientDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @Trim()
  readonly customer_code?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @Trim()
  readonly pancake?: string
}
