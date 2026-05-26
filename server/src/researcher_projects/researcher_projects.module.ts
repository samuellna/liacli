import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchProject } from './researcher_projects.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { ResearchProjectsService } from './researcher_projects.service';
import { ResearchProjectsController } from './researcher_projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResearchProject, Researchers, ExamType])],
  providers: [ResearchProjectsService],
  controllers: [ResearchProjectsController],
  exports: [ResearchProjectsService],
})
export class ResearchProjectsModule {}
