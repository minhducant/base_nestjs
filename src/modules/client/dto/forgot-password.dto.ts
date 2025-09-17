import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail } from 'class-validator'
import { Trim, ToLowerCase } from 'src/shares/decorators/transforms.decorator'

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
    example: 'ecomove@example.com',
  })
  @IsDefined()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email: string
}

export interface CacheForgotPassword {
  code: string
  attempt: number
}
