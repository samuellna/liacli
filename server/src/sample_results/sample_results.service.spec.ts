/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { SampleResultsService } from './sample_results.service';

import {
  ApprovalStatus,
  Sample,
  SampleStatus,
} from 'src/samples/samples.entity';

import { SampleResult } from './sample_results.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { EmailService } from 'src/email/email.service';

describe('SampleResultsService', () => {
  let service: SampleResultsService;

  let sampleRepository: jest.Mocked<Repository<Sample>>;
  let sampleResultRepository: jest.Mocked<Repository<SampleResult>>;
  let examTypeRepository: jest.Mocked<Repository<ExamType>>;

  const mockSampleRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockSampleResultRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockExamTypeRepository = {
    findOneBy: jest.fn(),
  };

  const mockPdfService = {
    generateResultPdf: jest.fn(),
  };

  const mockEmailService = {
    sendResultEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SampleResultsService,
        {
          provide: getRepositoryToken(Sample),
          useValue: mockSampleRepository,
        },
        {
          provide: getRepositoryToken(SampleResult),
          useValue: mockSampleResultRepository,
        },
        {
          provide: getRepositoryToken(ExamType),
          useValue: mockExamTypeRepository,
        },
        {
          provide: PdfService,
          useValue: mockPdfService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<SampleResultsService>(SampleResultsService);

    sampleRepository = module.get(getRepositoryToken(Sample));

    sampleResultRepository = module.get(getRepositoryToken(SampleResult));

    examTypeRepository = module.get(getRepositoryToken(ExamType));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const sampleId = 1;
    const examTypeId = 10;
    const resultData: Record<string, any> = { glucose: 95 };
    const examType = { id: examTypeId, name: 'Glicose' };

    const baseSample = {
      id: sampleId,
      protocol: 'ABC123',
      approvalStatus: ApprovalStatus.APPROVED,
      status: SampleStatus.PENDING,
      researchProject: {
        examTypes: [examType],
      },
      results: [],
    };

    it('should create a sample result', async () => {
      const createdResult = {
        id: 1,
        sample: { id: sampleId },
        examType: { id: examTypeId },
        resultData,
        observations: null,
      };

      const fetchedResult = {
        ...createdResult,
        sample: baseSample,
        examType,
      };

      sampleRepository.findOne.mockResolvedValue(
        baseSample as unknown as Sample,
      );

      examTypeRepository.findOneBy.mockResolvedValue(examType as ExamType);

      sampleResultRepository.create.mockReturnValue(
        createdResult as SampleResult,
      );

      sampleResultRepository.save.mockResolvedValue(
        createdResult as SampleResult,
      );

      sampleResultRepository.findOne.mockResolvedValue(
        fetchedResult as unknown as SampleResult,
      );

      const result = await service.create(sampleId, examTypeId, resultData);

      expect(result).toEqual(fetchedResult);

      expect(sampleRepository.findOne).toHaveBeenCalledWith({
        where: { id: sampleId },
        relations: [
          'researchProject',
          'researchProject.examTypes',
          'results',
          'results.examType',
        ],
      });

      expect(examTypeRepository.findOneBy).toHaveBeenCalledWith({
        id: examTypeId,
      });

      expect(sampleResultRepository.create).toHaveBeenCalledWith({
        sample: { id: sampleId },
        examType: { id: examTypeId },
        resultData,
        observations: null,
      });

      expect(sampleResultRepository.save).toHaveBeenCalledWith(createdResult);

      expect(sampleRepository.update).toHaveBeenCalledWith(sampleId, {
        status: SampleStatus.DONE,
      });

      expect(sampleResultRepository.findOne).toHaveBeenCalledWith({
        where: { id: createdResult.id },
        relations: ['sample', 'examType'],
      });
    });

    it('should throw NotFoundException if sample does not exist', async () => {
      sampleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(sampleId, examTypeId, resultData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if sample is not approved', async () => {
      sampleRepository.findOne.mockResolvedValue({
        ...baseSample,
        approvalStatus: ApprovalStatus.PENDING,
      } as unknown as Sample);

      await expect(
        service.create(sampleId, examTypeId, resultData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if exam type does not exist', async () => {
      sampleRepository.findOne.mockResolvedValue(
        baseSample as unknown as Sample,
      );

      examTypeRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(sampleId, examTypeId, resultData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if exam type does not belong to the sample project', async () => {
      sampleRepository.findOne.mockResolvedValue({
        ...baseSample,
        researchProject: { examTypes: [] },
      } as unknown as Sample);

      examTypeRepository.findOneBy.mockResolvedValue(examType as ExamType);

      await expect(
        service.create(sampleId, examTypeId, resultData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if result already exists', async () => {
      sampleRepository.findOne.mockResolvedValue({
        ...baseSample,
        results: [{ examType: { id: examTypeId } }],
      } as unknown as Sample);

      examTypeRepository.findOneBy.mockResolvedValue(examType as ExamType);

      await expect(
        service.create(sampleId, examTypeId, resultData),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByProtocol', () => {
    it('should return sample results by protocol', async () => {
      const sample = {
        id: 1,
        protocol: 'ABC123',
      };

      const results = [
        {
          id: 1,
          sample,
          examType: { id: 10 },
          resultData: { glucose: 95 },
        },
      ];

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      sampleResultRepository.find.mockResolvedValue(
        results as unknown as SampleResult[],
      );

      const result = await service.findByProtocol('ABC123');

      expect(result).toEqual(results);

      expect(sampleRepository.findOne).toHaveBeenCalledWith({
        where: { protocol: 'ABC123' },
      });

      expect(sampleResultRepository.find).toHaveBeenCalledWith({
        where: { sample: { id: sample.id } },
        relations: [
          'examType',
          'sample',
          'sample.researchProject',
          'sample.researchProject.researcher',
          'sample.approvedBy',
        ],
      });
    });

    it('should throw NotFoundException if sample is not found', async () => {
      sampleRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProtocol('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if no results are found', async () => {
      sampleRepository.findOne.mockResolvedValue({
        id: 1,
        protocol: 'ABC123',
      } as Sample);

      sampleResultRepository.find.mockResolvedValue([]);

      await expect(service.findByProtocol('ABC123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
