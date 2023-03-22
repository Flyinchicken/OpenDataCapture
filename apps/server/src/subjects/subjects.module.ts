import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subject, SubjectSchema } from './schemas/subject.schema';
import { SubjectsController } from './subjects.controller';
import { SubjectsRepository } from './subjects.repository';
import { SubjectsService } from './subjects.service';

import { CryptoModule } from '@/crypto/crypto.module';

@Module({
  imports: [
    CryptoModule,
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema
      }
    ])
  ],
  controllers: [SubjectsController],
  providers: [SubjectsRepository, SubjectsService],
  exports: [SubjectsService]
})
export class SubjectsModule {}
