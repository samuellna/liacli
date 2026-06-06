import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalStatus, Sample, SampleStatus } from './samples.entity';
import { CreateSampleDto } from './dto/create-sample.dto';
import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import { generateProtocol } from 'src/utils/generate_protocol';
import { Employees } from 'src/employees/employees.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,

    @InjectRepository(ResearchProject)
    private readonly researchProjectRepository: Repository<ResearchProject>,

    @InjectRepository(Employees)
    private readonly employeeRepository: Repository<Employees>,

    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<Sample[]> {
    return this.sampleRepository.find({
      relations: ['researchProject', 'researchProject.researcher', 'researchProject.examTypes', 'approvedBy'],
    });
  }

  async findOne(id: number): Promise<Sample | null> {
    return this.sampleRepository.findOne({
      where: { id },
      relations: ['researchProject', 'researchProject.researcher', 'researchProject.examTypes', 'approvedBy'],
    });
  }

  async findByProtocol(protocol: string): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({
      where: { protocol },
      relations: ['researchProject', 'researchProject.researcher', 'researchProject.examTypes', 'approvedBy'],
    });
    if (!sample) {
      throw new NotFoundException('Sample not found');
    }
    return sample;
  }

  async create(dto: CreateSampleDto): Promise<Sample> {
    const researchProject = await this.researchProjectRepository.findOne({
      where: { id: dto.researchProjectId },
      relations: ['researcher'],
    });

    if (!researchProject) {
      throw new NotFoundException('ResearchProject not found');
    }

    const newSample = this.sampleRepository.create({
      researchProject,
      animalsInThisShipment: dto.animalsInThisShipment,
      protocol: generateProtocol(),
      status: SampleStatus.PENDING,
      scheduledAt: new Date(dto.scheduledAt),
      approvalStatus: ApprovalStatus.PENDING,
    });

    return this.sampleRepository.save(newSample);
  }

  async approveSample(
    id: number,
    approved: boolean,
    employeeId: number,
    decisionReason?: string,
  ): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({
      where: { id },
      relations: ['researchProject', 'researchProject.researcher'],
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (sample.approvalStatus !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Sample already evaluated');
    }

    const employee = await this.employeeRepository.findOneBy({ id: employeeId });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    sample.approvalStatus = approved
      ? ApprovalStatus.APPROVED
      : ApprovalStatus.REJECTED;

    const researcher = sample.researchProject.researcher;

    if (sample.approvalStatus === ApprovalStatus.APPROVED) {
      await this.emailService.sendApprovalEmail({
        toEmail: researcher.email,
        pesquisadorNome: researcher.name,
        protocolo: sample.protocol,
        dataAgendada: sample.scheduledAt,
      });
    } else {
      await this.emailService.sendRejectionEmail({
        toEmail: researcher.email,
        pesquisadorNome: researcher.name,
        protocolo: sample.protocol,
        motivoReprovacao:
          decisionReason || 'Os dados enviados são inválidos ou insuficientes',
      });
    }

    sample.approvedBy = employee;
    sample.approvedAt = new Date();

    return this.sampleRepository.save(sample);
  }

  async updateStatus(id: number, status: SampleStatus): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({ where: { id } });
    if (!sample) {
      throw new NotFoundException('Sample not found');
    }
    if (sample.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new BadRequestException('Sample not approved');
    }
    sample.status = status;
    return this.sampleRepository.save(sample);
  }

  async delete(id: number): Promise<void> {
    await this.sampleRepository.delete(id);
  }
}
