import { Module, CacheModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as redisStore from 'cache-manager-redis-store'

import { ClientService } from './client.service'
import { MailModule } from '../mail/mail.module'
import { ClientController } from './client.controller'
import { redisConfig } from 'src/configs/redis.config'
import { EmailService } from 'src/shares/helpers/mail.helpers'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Client, ClientSchema } from './schemas/client.schema'
import { ClientPolicy, ClientPolicySchema } from './schemas/client-policy.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: ClientPolicy.name, schema: ClientPolicySchema },
    ]),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    MailModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, EmailService],
  exports: [ClientService],
})
export class ClientModule {}
