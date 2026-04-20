import { Module } from '@nestjs/common';
import { ExamTypesService } from './exam_types.service';
import { ExamTypesController } from './exam_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamType } from './exam_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamType])],
  providers: [ExamTypesService],
  controllers: [ExamTypesController],
  exports: [ExamTypesService],
})
export class ExamTypesModule {}
