import { Get, Post, Body, Patch, Param, Delete, Query, Controller } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger'

import { Goal } from './schemas/goal.schema'
import { GoalService } from './goal.service'
import { CreateGoalDto } from './dto/create-goal.dto'
import { ClientAuth } from 'src/shares/decorators/http.decorators'
import { UserID } from 'src/shares/decorators/get-user-id.decorator'

@ApiTags('Goals')
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Tạo mục tiêu giảm CO₂ mới cho người dùng' })
  async create(@Body() createGoalDto: CreateGoalDto, @UserID() client_id?: string): Promise<Goal> {
    return this.goalService.create(createGoalDto, client_id)
  }

  @Get()
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Lấy danh sách các mục tiêu giảm CO₂' })
  @ApiQuery({ name: 'month', required: false, description: 'Lọc theo tháng (YYYY-MM)' })
  async findAll(@UserID() client_id?: string, @Query('month') month?: string): Promise<Goal | null> {
    return this.goalService.findGoal(client_id, month)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Xem chi tiết mục tiêu theo ID' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu' })
  async findOne(@Param('id') id: string): Promise<Goal> {
    return this.goalService.findOne(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin mục tiêu' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu cần cập nhật' })
  async update(@Param('id') id: string, @Body() updateGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalService.update(id, updateGoalDto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: 'Xoá mục tiêu giảm CO₂ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu cần xoá' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.goalService.remove(id)
  }
}
