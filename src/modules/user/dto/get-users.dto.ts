import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsMongoId, IsOptional, IsString } from 'class-validator'
import { Trim } from 'src/shares/decorators/transforms.decorator'
import { PaginationDto } from 'src/shares/dtos/pagination.dto'

export class GetUsersDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string

  @Expose()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly role?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly full_name?: string
}
