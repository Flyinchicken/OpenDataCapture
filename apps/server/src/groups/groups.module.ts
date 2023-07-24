import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupEntity, GroupSchema } from './entities/group.entity.js';
import { GroupsController } from './groups.controller.js';
import { GroupsService } from './groups.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GroupEntity.modelName,
        schema: GroupSchema
      }
    ])
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService]
})
export class GroupsModule {}
