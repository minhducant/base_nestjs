import { Body, Controller, Delete, Get, Param, Post, Patch, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { TripService } from './trip.service'
import { GetTripDto } from './dto/get-trip.dto'
import { TripItem } from './schemas/trip.schema'
import { ClientAuth } from 'src/shares/decorators/http.decorators'
import { UserID } from 'src/shares/decorators/get-user-id.decorator'

@ApiTags('Trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Lấy danh sách trip theo client' })
  async findByClient(@UserID() client_id: string, @Query() query: GetTripDto) {
    return this.tripService.findByClient(client_id, query)
  }

  @Get('ongoing')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Lấy trip đang ongoing của client' })
  async findOngoingTrip(@UserID() client_id: string) {
    return this.tripService.findOngoingTripByClient(client_id)
  }

  @Get('report')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[REPORT] Báo cáo tổng lượng phát thải theo ngày' })
  async getReport(@UserID() client_id: string, @Query() query: GetTripDto) {
    return this.tripService.getReport(client_id, query)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Lấy thông tin trip' })
  async findById(@Param('id') id: string) {
    return this.tripService.findById(id)
  }

  @Post('')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Tạo mới trip theo client' })
  async create(@UserID() client_id: string, @Body() body: Partial<TripItem>) {
    return this.tripService.create(client_id, body)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Xoá trip theo id' })
  async delete(@Param('id') id: string) {
    return this.tripService.delete(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: '[TRIP] Cập nhật trip theo id' })
  async update(@Param('id') id: string, @Body() body: Partial<TripItem>) {
    return this.tripService.update(id, body)
  }
}
