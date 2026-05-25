import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalStatus, Sample, SampleStatus } from './samples.entity';
import { CreateSampleDto } from './dto/create-sample.dto';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import { generateProtocol } from 'src/utils/generate_protocol';
import { Employees } from 'src/employees/employees.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,

    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,

    @InjectRepository(Researchers)
    private readonly researcherRepository: Repository<Researchers>,

    @InjectRepository(Employees)
    private readonly employeeRepository: Repository<Employees>,

    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<Sample[]> {
    return await this.sampleRepository.find();
  }

  async findOne(id: number): Promise<Sample | null> {
    return await this.sampleRepository.findOne({ where: { id } });
  }

  async findByProtocol(protocol: string) {
    const sample = await this.sampleRepository.findOne({
      where: { protocol },
      relations: ['examType'],
    });
    if (!sample) {
      throw new NotFoundException('Sample not found');
    }
    return sample;
  }

  async create(sample: CreateSampleDto): Promise<Sample> {
    // Busca o ExamType e o Researcher para garantir que existem antes de criar a amostra
    const examType = await this.examTypeRepository.findOne({
      where: { id: sample.examTypeId },
    });

    if (!examType) {
      throw new NotFoundException('ExamType not found');
    }
    console.log('ExamType encontrado:', examType);

    // Busca o Researcher para garantir que existe antes de criar a amostra
    const researcher = await this.researcherRepository.findOne({
      where: { id: sample.researcherId },
    });
    console.log('Researcher encontrado:', researcher);

    if (!researcher) {
      throw new NotFoundException('Researcher not found');
    }

    const newSample = this.sampleRepository.create({
      examType,
      researcher: researcher,
      protocol: generateProtocol(),
      status: SampleStatus.PENDING,
      scheduledAt: new Date(sample.scheduledAt),
      approvalStatus: ApprovalStatus.PENDING,
    });

    return await this.sampleRepository.save(newSample);
  }

  // Método para aprovar ou rejeitar uma solitação de amostra
  async approveSample(
    id: number,
    approved: boolean,
    employeeId: number,
    decisionReason?: string,
  ): Promise<Sample> {
    const sample = await this.sampleRepository.findOneBy({ id });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (sample.approvalStatus !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Sample already evaluated');
    }

    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    sample.approvalStatus = approved
      ? ApprovalStatus.APPROVED
      : ApprovalStatus.REJECTED;

    if (sample.approvalStatus === ApprovalStatus.APPROVED) {
      await this.emailService.sendApprovalEmail({
        toEmail: employee.email,
        pesquisadorNome: employee.name,
        protocolo: sample.protocol,
        dataAgendada: sample.scheduledAt,
      });
    } else if (sample.approvalStatus === ApprovalStatus.REJECTED) {
      await this.emailService.sendRejectionEmail({
        toEmail: employee.email,
        pesquisadorNome: employee.name,
        protocolo: sample.protocol,
        motivoReprovacao:
          decisionReason || 'Os dados enviados são inválidos ou insuficientes',
      });
    }
    sample.approvedBy = employee;
    sample.approvedAt = new Date();

    return this.sampleRepository.save(sample);
  }

  async updateStatus(id: number, status: SampleStatus): Promise<Sample | null> {
    const sample = await this.sampleRepository.findOne({ where: { id } });
    if (!sample) {
      throw new NotFoundException('Sample not found');
    }
    if (sample.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new BadRequestException('Sample not approved');
    }
    sample.status = status;
    return await this.sampleRepository.save(sample);
  }

  async delete(id: number): Promise<void> {
    await this.sampleRepository.delete(id);
  }
}
