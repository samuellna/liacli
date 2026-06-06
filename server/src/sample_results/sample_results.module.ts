import { Module } from '@nestjs/common';
import { SampleResultsService } from './sample_results.service';
import { SampleResultsController } from './sample_results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleResult } from './sample_results.entity';
import { Sample } from 'src/samples/samples.entity';
import { SamplesModule } from 'src/samples/samples.module';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { ExamTypesModule } from 'src/exam_types/exam_types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SampleResult, Sample, ExamType]),
    SamplesModule,
    ExamTypesModule,
  ],
  providers: [SampleResultsService],
  controllers: [SampleResultsController],
})
export class SampleResultsModule {}
