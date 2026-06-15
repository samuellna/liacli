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
import { ExamType } from 'src/exam_types/exam_types.entity';

@Injectable()
export class SampleResultsService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,

    @InjectRepository(SampleResult)
    private readonly sampleResultRepository: Repository<SampleResult>,

    @InjectRepository(ExamType)
    private readonly examTypeRepository: Repository<ExamType>,
  ) {}

  async create(
    sampleId: number,
    examTypeId: number,
    resultData: Record<string, any>,
    observations?: string,
  ): Promise<SampleResult> {
    const sample = await this.sampleRepository.findOne({
      where: { id: sampleId },
      relations: [
        'researchProject',
        'researchProject.examTypes',
        'results',
        'results.examType',
      ],
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    if (sample.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new BadRequestException('Sample not approved');
    }

    const examType = await this.examTypeRepository.findOneBy({
      id: examTypeId,
    });

    if (!examType) {
      throw new NotFoundException('ExamType not found');
    }

    const examTypeBelongsToProject = sample.researchProject.examTypes.some(
      (et) => et.id === examTypeId,
    );

    if (!examTypeBelongsToProject) {
      throw new BadRequestException(
        'ExamType does not belong to this sample project',
      );
    }

    const alreadyHasResult = sample.results.some(
      (r) => r.examType.id === examTypeId,
    );

    if (alreadyHasResult) {
      throw new BadRequestException(
        'Result for this exam type already exists on this sample',
      );
    }

    const result = this.sampleResultRepository.create({
      sample: { id: sample.id } as Sample,
      examType: { id: examType.id } as ExamType,
      resultData,
      observations: observations || null,
    });

    const savedResult = await this.sampleResultRepository.save(result);

    const totalExamTypes = sample.researchProject.examTypes.length;
    const totalResults = sample.results.length + 1;

    if (totalResults === totalExamTypes) {
      await this.sampleRepository.update(sample.id, {
        status: SampleStatus.DONE,
      });
    }

    return this.sampleResultRepository.findOne({
      where: { id: savedResult.id },
      relations: ['sample', 'examType'],
    }) as Promise<SampleResult>;
  }

  async findAll(unique?: boolean): Promise<SampleResult[]> {
    const results = await this.sampleResultRepository.find({
      relations: [
        'sample',
        'sample.researchProject',
        'sample.researchProject.researcher',
        'sample.researchProject.examTypes',
        'examType',
      ],
    });

    if (!unique) return results;

    const seen = new Set<number>();
    return results.filter((r) => {
      if (seen.has(r.sample.id)) return false;
      seen.add(r.sample.id);
      return true;
    });
  }

  async findBySampleId(sampleId: number): Promise<SampleResult[]> {
    const results = await this.sampleResultRepository.find({
      where: { sample: { id: sampleId } },
      relations: [
        'examType',
        'sample',
        'sample.researchProject',
        'sample.researchProject.researcher',
        'sample.approvedBy',
      ],
    });

    if (!results.length) {
      throw new NotFoundException('No results found for this sample');
    }

    return results;
  }

  async findAmountResults(): Promise<number> {
    const results = await this.sampleResultRepository.find();
    const createdThisMonth = results.filter((result) => {
      const now = new Date();
      const createdAt = new Date(result.createdAt);
      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    });
    return createdThisMonth.length;
  }

  async findByProtocol(protocol: string): Promise<SampleResult[]> {
    const sample = await this.sampleRepository.findOne({
      where: { protocol },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    const results = await this.sampleResultRepository.find({
      where: { sample: { id: sample.id } },
      relations: [
        'examType',
        'sample',
        'sample.researchProject',
        'sample.researchProject.researcher',
        'sample.approvedBy',
      ],
    });

    if (!results.length) {
      throw new NotFoundException('No results found for this sample');
    }

    return results;
  }

  async validateResult(id: number): Promise<SampleResult> {
    const result = await this.sampleResultRepository.findOne({
      where: { id },
      relations: ['sample'],
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    result.validated = true;
    return this.sampleResultRepository.save(result);
  }

  async validateAllResultsBySample(sampleId: number): Promise<SampleResult[]> {
    const results = await this.sampleResultRepository.find({
      where: { sample: { id: sampleId } },
    });

    if (!results.length) {
      throw new NotFoundException('No results found for this sample');
    }

    const updated = results.map((r) => ({ ...r, validated: true }));
    return this.sampleResultRepository.save(updated);
  }

  async rejectSampleResults(sampleId: number): Promise<Sample> {
    const sample = await this.sampleRepository.findOne({
      where: { id: sampleId },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    sample.status = SampleStatus.REJECTED;
    return this.sampleRepository.save(sample);
  }

  async findOneForPdf(
    id: number,
  ): Promise<{ sample: Sample; results: SampleResult[] }> {
    const result = await this.sampleResultRepository.findOne({
      where: { id },
      relations: ['sample'],
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    const sample = await this.sampleRepository.findOne({
      where: { id: result.sample.id },
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

    const results = await this.sampleResultRepository.find({
      where: { sample: { id: sample.id } },
      relations: ['examType'],
    });

    return { sample, results };
  }
}
