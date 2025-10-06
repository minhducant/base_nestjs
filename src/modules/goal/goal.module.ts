import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { Goal, GoalSchema } from './schemas/goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema, collection: 'goal' },
    ]),
  ],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class GoalModule {}
