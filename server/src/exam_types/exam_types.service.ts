import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamType } from './exam_types.entity';
import { Repository } from 'typeorm';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private readonly examTypesRepository: Repository<ExamType>,
  ) {}

  async findAll(): Promise<ExamType[]> {
    return this.examTypesRepository.find();
  }

  async findOne(id: number): Promise<ExamType | null> {
    return this.examTypesRepository.findOneBy({ id });
  }

  async create(examTypeDto: CreateExamTypeDto): Promise<ExamType> {
    return this.examTypesRepository.save(examTypeDto);
  }

  async delete(id: number): Promise<void> {
    await this.examTypesRepository.delete(id);
  }

  async update(
    id: number,
    examTypeDto: UpdateExamTypeDto,
  ): Promise<ExamType | null> {
    // Prevent updating if both name and description are missing
    if (!examTypeDto.name && !examTypeDto.description) return null;

    await this.examTypesRepository.update(id, {
      ...examTypeDto,
      updatedAt: new Date(),
    });
    return this.examTypesRepository.findOneBy({ id });
  }
}
