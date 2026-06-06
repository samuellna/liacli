import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './samples.entity';
import { Employees } from 'src/employees/employees.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmailModule } from 'src/email/email.module';
import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import { ResearchProjectsModule } from 'src/researcher_projects/researcher_projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sample, Employees, ResearchProject]),
    EmployeesModule,
    EmailModule,
    ResearchProjectsModule,
  ],
  providers: [SamplesService],
  controllers: [SamplesController],
  exports: [SamplesService],
})
export class SamplesModule {}
