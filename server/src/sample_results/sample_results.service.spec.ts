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

describe('SampleResultsService', () => {
  let service: SampleResultsService;

  let sampleRepository: jest.Mocked<Repository<Sample>>;
  let sampleResultRepository: jest.Mocked<Repository<SampleResult>>;

  const mockSampleRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockSampleResultRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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
      ],
    }).compile();

    service = module.get<SampleResultsService>(SampleResultsService);

    sampleRepository = module.get(getRepositoryToken(Sample));

    sampleResultRepository = module.get(getRepositoryToken(SampleResult));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a sample result', async () => {
      const sample = {
        id: 1,
        protocol: 'ABC123',
        approvalStatus: ApprovalStatus.APPROVED,
        status: SampleStatus.PENDING,
      };

      const resultData: Record<string, any> = {
        glucose: 95,
      };

      const createdResult = {
        id: 1,
        sample,
        resultData,
        createdAt: new Date(),
      };

      sampleRepository.findOneBy.mockResolvedValue(sample as Sample);

      sampleResultRepository.findOne.mockResolvedValue(null);

      sampleResultRepository.create.mockReturnValue(
        createdResult as SampleResult,
      );

      sampleResultRepository.save.mockResolvedValue(
        createdResult as SampleResult,
      );

      const result = await service.create(1, resultData);

      expect(result).toEqual(createdResult);

      expect(sampleRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(sampleResultRepository.findOne).toHaveBeenCalledWith({
        where: {
          sample: {
            id: 1,
          },
        },
      });

      expect(sampleResultRepository.create).toHaveBeenCalled();

      expect(sampleRepository.save).toHaveBeenCalled();

      expect(sampleResultRepository.save).toHaveBeenCalledWith(createdResult);

      expect(sample.status).toBe(SampleStatus.DONE);
    });

    it('should throw NotFoundException if sample does not exist', async () => {
      sampleRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(1, {
          glucose: 95,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if sample is not approved', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.REJECTED,
      };

      sampleRepository.findOneBy.mockResolvedValue(sample as Sample);

      await expect(
        service.create(1, {
          glucose: 95,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if result already exists', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.APPROVED,
      };

      sampleRepository.findOneBy.mockResolvedValue(sample as Sample);

      sampleResultRepository.findOne.mockResolvedValue({
        id: 1,
      });

      await expect(
        service.create(1, {
          glucose: 95,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByProtocol', () => {
    it('should return a sample result by protocol', async () => {
      const sample = {
        id: 1,
        protocol: 'ABC123',
      };

      const resultData: Record<string, any> = {
        glucose: 95,
      };

      const sampleResult = {
        id: 1,
        sample,
        resultData,
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      sampleResultRepository.findOne.mockResolvedValue(
        sampleResult as SampleResult,
      );

      const result = await service.findByProtocol('ABC123');

      expect(result).toEqual(sampleResult);

      expect(sampleRepository.findOne).toHaveBeenCalledWith({
        where: {
          protocol: 'ABC123',
        },
      });

      expect(sampleResultRepository.findOne).toHaveBeenCalledWith({
        where: {
          sample: {
            id: sample.id,
          },
        },
        relations: [
          'sample',
          'sample.examType',
          'sample.researcher',
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

    it('should throw NotFoundException if result is not found', async () => {
      const sample = {
        id: 1,
        protocol: 'ABC123',
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      sampleResultRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProtocol('ABC123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
