import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ApprovalStatus,
  Sample,
  SampleStatus,
} from 'src/samples/samples.entity';
import { Repository } from 'typeorm';
import { SampleResult } from './sample_results.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SampleResultsService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(SampleResult)
    private readonly sampleResultRepository: Repository<SampleResult>,
  ) {}

  async create(
    sampleId: number,
    resultData: Record<string, any>,
  ): Promise<SampleResult> {
    // Verifica se a amostra existe
    const sample = await this.sampleRepository.findOneBy({ id: sampleId });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (sample.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new BadRequestException('Sample not approved');
    }

    // Verifica se já existe um resultado para essa amostra
    const existing = await this.sampleResultRepository.findOne({
      where: { sample: { id: sampleId } },
    });

    if (existing) {
      throw new BadRequestException('Result already exists');
    }

    // Cria o resultado e atualiza o status da amostra
    const result = this.sampleResultRepository.create({
      sample,
      resultData,
      createdAt: new Date(),
    });
    sample.status = SampleStatus.DONE;

    // Atualiza o status da amostra e salva o resultado
    await this.sampleRepository.save(sample);
    return this.sampleResultRepository.save(result);
  }

  async findByProtocol(protocol: string): Promise<SampleResult> {
    // Busca a amostra pelo protocolo
    const sample = await this.sampleRepository.findOne({
      where: { protocol },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    // Busca o resultado associado à amostra
    const result = await this.sampleResultRepository.findOne({
      where: { sample: { id: sample.id } },
      relations: [
        'sample',
        'sample.examType',
        'sample.patientOrResearcher',
        'sample.approvedBy',
      ],
    });

    if (!result) {
      throw new NotFoundException('Result not found for this sample');
    }

    return result;
  }
}
