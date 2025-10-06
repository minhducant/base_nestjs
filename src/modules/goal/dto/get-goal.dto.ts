import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from 'src/shares/dtos/pagination.dto'
import { Trim } from 'src/shares/decorators/transforms.decorator'

export class GetGoalDto extends PaginationDto {}
