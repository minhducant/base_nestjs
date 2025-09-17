import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator'

import { ToLowerCase, Trim } from 'src/shares/decorators/transforms.decorator'

export class ChangePasswordByCodeDto {
  @ApiProperty({
    required: true,
    example: 'jonh@gmail.com',
  })
  @IsDefined()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsDefined()
  @IsNumberString()
  code: string

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsOptional()
  @IsDefined()
  @IsString()
  password?: string
}

export default ChangePasswordByCodeDto
