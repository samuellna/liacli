import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './samples.entity';
import { ResearchersModule } from 'src/researchers/researchers.module';
import { ExamTypesModule } from 'src/exam_types/exam_types.module';
import { Researchers } from 'src/researchers/researchers.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sample, Researchers, ExamType]),
    ResearchersModule,
    ExamTypesModule,
  ],
  providers: [SamplesService],
  controllers: [SamplesController],
  exports: [SamplesService],
})
export class SamplesModule {}
