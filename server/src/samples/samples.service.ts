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
import { Researchers } from 'src/researchers/researchers.entity';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,

    @InjectRepository(ResearchProject)
    private readonly researchProjectRepository: Repository<ResearchProject>,

    @InjectRepository(Employees)
    private readonly employeeRepository: Repository<Employees>,

    @InjectRepository(Researchers)
    private readonly researcherRepository: Repository<Researchers>,

    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<Sample[]> {
    return this.sampleRepository.find({
      relations: [
        'researchProject',
        'researchProject.researcher',
        'researchProject.examTypes',
        'approvedBy',
      ],
    });
  }

  async findOne(id: number): Promise<Sample | null> {
    return this.sampleRepository.findOne({
      where: { id },
      relations: [
        'researchProject',
        'researchProject.researcher',
        'researchProject.examTypes',
        'approvedBy',
      ],
    });
  }

  async findByProtocol(protocol: string): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({
      where: { protocol },
      relations: [
        'researchProject',
        'researchProject.researcher',
        'researchProject.examTypes',
        'approvedBy',
      ],
    });
    if (!sample) {
      throw new NotFoundException('Sample not found');
    }
    return sample;
  }

  private async generateUniqueProtocol(): Promise<string> {
    while (true) {
      const protocol = generateProtocol();

      const exists = await this.sampleRepository.exists({
        where: { protocol },
      });

      if (!exists) {
        return protocol;
      }
    }
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
      protocol: await this.generateUniqueProtocol(),
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

    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });

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
    sample.updatedAt = new Date();

    return this.sampleRepository.save(sample);
  }

  // Retorna a quantidade de amostras que estão com status ANALYZING para exibir no dashboard
  async findAmountInAnalysis(): Promise<number> {
    const samplesInAnalysis = await this.sampleRepository.find({
      where: { status: SampleStatus.ANALYZING },
    });
    return samplesInAnalysis.length;
  }

  async findAmountPendingApproval(): Promise<number> {
    const pendingApprovalSamples = await this.sampleRepository.find({
      where: { approvalStatus: ApprovalStatus.PENDING },
    });
    return pendingApprovalSamples.length;
  }

  async findPendingApprovalSamples(): Promise<
    {
      protocol: string;
      researcher: string;
      date: Date;
      firstTime: boolean;
    }[]
  > {
    const pendingApprovalSamples = await this.sampleRepository.find({
      where: { approvalStatus: ApprovalStatus.PENDING },
      relations: ['researchProject', 'researchProject.researcher'],
    });

    const emails = pendingApprovalSamples.map(
      (s) => s.researchProject.researcher.email,
    );

    const firstTimeResearchers = await Promise.all(
      emails.map((email) =>
        this.researcherRepository
          .findBy({ email })
          .then((researchers) => researchers.length === 1),
      ),
    );

    const response = pendingApprovalSamples
      .map((sample) => ({
        protocol: sample.protocol,
        researcher: sample.researchProject.researcher.name,
        date: sample.researchProject.preferredDate,
        firstTime:
          firstTimeResearchers[
            emails.indexOf(sample.researchProject.researcher.email)
          ],
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Ordena por data

    return response.slice(0, 5); // Retorna apenas os 5 primeiros resultados
  }

  async findAmountApprovedPendingCollection(): Promise<number> {
    const approvedPendingCollectionSamples = await this.sampleRepository.find({
      where: {
        approvalStatus: ApprovalStatus.APPROVED,
        status: SampleStatus.PENDING,
      },
    });
    return approvedPendingCollectionSamples.length;
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
