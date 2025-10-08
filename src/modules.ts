import * as redisStore from 'cache-manager-redis-store'

import { BullModule } from '@nestjs/bull'
import { ConsoleModule } from 'nestjs-console'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { CacheModule, Logger } from '@nestjs/common'

import { mongodb } from 'src/configs/database.config'
import { redisConfig } from 'src/configs/redis.config'
import { AuthModule } from './modules/auth/auth.module'
import { MailModule } from './modules/mail/mail.module'
import { TripModule } from './modules/trip/trip.module'
import { GoalModule } from './modules/goal/goal.module'
import { UsersModule } from './modules/user/user.module'
import { UploadsModule } from './modules/upload/upload.module'
import { ClientModule } from './modules/client/client.module'
import { KafkaModule } from 'src/shares/kafka-client/kafka-module'
import { HttpClientModule } from 'src/shares/http-clients/http.module'

const Modules = [
  Logger,
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ScheduleModule.forRoot(),
  KafkaModule,
  ConsoleModule,
  HttpClientModule,
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  AuthModule,
  UsersModule,
  MailModule,
  ClientModule,
  TripModule,
  GoalModule,
  UploadsModule,
]
export default Modules
