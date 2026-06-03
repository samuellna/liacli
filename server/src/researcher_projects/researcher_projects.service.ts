import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ResearchProject } from './researcher_projects.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { CreateResearchProjectDto } from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';

@Injectable()
export class ResearchProjectsService {
  constructor(
    @InjectRepository(ResearchProject)
    private readonly researchProjectRepository: Repository<ResearchProject>,

    @InjectRepository(Researchers)
    private readonly researcherRepository: Repository<Researchers>,

    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
  ) {}

  async findAll(): Promise<ResearchProject[]> {
    return this.researchProjectRepository.find({
      relations: ['researcher', 'examTypes', 'samples'],
    });
  }

  async findOne(id: number): Promise<ResearchProject> {
    const project = await this.researchProjectRepository.findOne({
      where: { id },
      relations: ['researcher', 'examTypes', 'samples'],
    });
    if (!project) {
      throw new NotFoundException('ResearchProject not found');
    }
    return project;
  }

  async findByResearcher(researcherId: number): Promise<ResearchProject[]> {
    return this.researchProjectRepository.find({
      where: { researcher: { id: researcherId } },
      relations: ['researcher', 'examTypes', 'samples'],
    });
  }

  async create(dto: CreateResearchProjectDto): Promise<ResearchProject> {
    const researcher = await this.researcherRepository.findOneBy({
      id: dto.researcherId,
    });
    if (!researcher) {
      throw new NotFoundException('Researcher not found');
    }

    let examTypes: ExamType[] = [];
    if (dto.examTypeIds && dto.examTypeIds.length > 0) {
      examTypes = await this.examTypeRepository.findBy({
        id: In(dto.examTypeIds),
      });
      if (examTypes.length !== dto.examTypeIds.length) {
        throw new NotFoundException('One or more ExamTypes not found');
      }
    }

    const project = this.researchProjectRepository.create({
      title: dto.title,
      course: dto.course,
      researchLab: dto.researchLab,
      animalSpecies: dto.animalSpecies,
      totalAnimals: dto.totalAnimals,
      expectedShipments: dto.expectedShipments,
      preferredDate: dto.preferredDate
        ? new Date(dto.preferredDate)
        : undefined,
      researcher,
      examTypes,
    });

    return this.researchProjectRepository.save(project);
  }

  async update(
    id: number,
    dto: UpdateResearchProjectDto,
  ): Promise<ResearchProject> {
    const project = await this.findOne(id);

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.course !== undefined) project.course = dto.course;
    if (dto.researchLab !== undefined) project.researchLab = dto.researchLab;
    if (dto.animalSpecies !== undefined)
      project.animalSpecies = dto.animalSpecies;
    if (dto.totalAnimals !== undefined) project.totalAnimals = dto.totalAnimals;
    if (dto.expectedShipments !== undefined)
      project.expectedShipments = dto.expectedShipments;
    if (dto.preferredDate !== undefined)
      project.preferredDate = new Date(dto.preferredDate);

    if (dto.examTypeIds !== undefined) {
      const examTypes = await this.examTypeRepository.findBy({
        id: In(dto.examTypeIds),
      });
      if (examTypes.length !== dto.examTypeIds.length) {
        throw new NotFoundException('One or more ExamTypes not found');
      }
      project.examTypes = examTypes;
    }

    project.updatedAt = new Date();
    return this.researchProjectRepository.save(project);
  }

  async delete(id: number): Promise<void> {
    await this.researchProjectRepository.delete(id);
  }
}
