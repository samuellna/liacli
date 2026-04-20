import { Module } from '@nestjs/common';
import { ResearchersController } from './researchers.controller';
import { ResearchersService } from './researchers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Researchers } from './researchers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Researchers])],
  controllers: [ResearchersController],
  providers: [ResearchersService],
  exports: [ResearchersService],
})
export class ResearchersModule {}
