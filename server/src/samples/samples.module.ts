import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './samples.entity';
import { ResearchersModule } from 'src/researchers/researchers.module';
import { ExamTypesModule } from 'src/exam_types/exam_types.module';
import { Researchers } from 'src/researchers/researchers.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sample, Researchers, ExamType, Employees]),
    ResearchersModule,
    ExamTypesModule,
    EmployeesModule,
    EmailModule,
  ],
  providers: [SamplesService],
  controllers: [SamplesController],
  exports: [SamplesService],
})
export class SamplesModule {}
