import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsMongoId, IsArray, IsEnum } from 'class-validator'

import { ClientRole, ClientStatus, ClientStatusMode } from 'src/shares/enums/client.enum'

export class CreateClientDto {
  @ApiProperty({
    required: false,
    example: 'user@gmail.com',
  })
  // @IsNotEmpty()
  @IsOptional()
  readonly email: string

  @ApiProperty({
    required: false,
    example: '123',
    default: '123',
  })
  @IsOptional()
  // @IsNotEmpty()
  readonly password: string

  @ApiProperty({
    required: false,
    example: 'john wick',
  })
  @IsOptional()
  readonly name: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly birthday?: Date

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly gender?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly full_name?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly japanese_name?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly method_contact?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly pancake?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly phone?: string

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // readonly status?: string

  @ApiProperty({ required: false, enum: ClientStatus })
  @IsOptional()
  readonly status?: ClientStatus

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly status_mode?: number

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  source_id?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly zip_code?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly name_mobile?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly address?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly note?: string

  @ApiProperty({required: false})
  @IsOptional()
  payment_code?: string

  @ApiProperty({
    example: [ClientRole.khach_hang],
    enum: ClientRole,
  })
  @IsOptional()
  role?: ClientRole[]
}
