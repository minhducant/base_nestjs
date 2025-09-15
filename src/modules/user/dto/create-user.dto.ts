import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @IsNotEmpty()
  readonly password: string

  @ApiProperty({
    required: true,
    example: 'john wick',
  })
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  permise: string[]

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  image_url: string[]



}
