import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Researchers } from './researchers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResearcherDto } from './dto/create-researcher.dto';
import { UpdateResearcherDto } from './dto/update-researcher.dto';

@Injectable()
export class ResearchersService {
  constructor(
    @InjectRepository(Researchers)
    private readonly researchersRepository: Repository<Researchers>,
  ) {}

  async findAll(): Promise<Researchers[]> {
    return this.researchersRepository.find();
  }

  async findOne(id: number): Promise<Researchers | null> {
    const researcher = await this.researchersRepository.findOneBy({ id });
    if (!researcher) {
      return null;
    }
    return researcher;
  }

  async create(researcherDto: CreateResearcherDto): Promise<Researchers> {
    const researcher = this.researchersRepository.create(researcherDto);
    return await this.researchersRepository.save(researcher);
  }

  async update(
    id: number,
    researcherDto: UpdateResearcherDto,
  ): Promise<Researchers | null> {
    await this.researchersRepository.update(id, researcherDto);
    return this.researchersRepository.findOneBy({ id });
  }
}
