import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TripService } from './trip.service'
import { TripController } from './trip.controller'
import { TripItem, TripItemSchema } from './schemas/trip.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: TripItem.name, schema: TripItemSchema }])],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
