/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SamplesService } from './samples.service';

import { ApprovalStatus, Sample, SampleStatus } from './samples.entity';

import { ExamType } from 'src/exam_types/exam_types.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import { Employees } from 'src/employees/employees.entity';
import { Repository } from 'typeorm';

jest.mock('src/utils/generate_protocol', () => ({
  generateProtocol: jest.fn(() => 'PROTO-123'),
}));

describe('SamplesService', () => {
  let service: SamplesService;

  let sampleRepository: jest.Mocked<Repository<Sample>>;
  let examTypeRepository: jest.Mocked<Repository<ExamType>>;
  let researcherRepository: jest.Mocked<Repository<Researchers>>;
  let employeeRepository: jest.Mocked<Repository<Employees>>;

  const mockSampleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockExamTypeRepository = {
    findOne: jest.fn(),
  };

  const mockResearcherRepository = {
    findOne: jest.fn(),
  };

  const mockEmployeeRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplesService,

        {
          provide: getRepositoryToken(Sample),
          useValue: mockSampleRepository,
        },

        {
          provide: getRepositoryToken(ExamType),
          useValue: mockExamTypeRepository,
        },

        {
          provide: getRepositoryToken(Researchers),
          useValue: mockResearcherRepository,
        },

        {
          provide: getRepositoryToken(Employees),
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<SamplesService>(SamplesService);

    sampleRepository = module.get(getRepositoryToken(Sample));

    examTypeRepository = module.get(getRepositoryToken(ExamType));

    researcherRepository = module.get(getRepositoryToken(Researchers));

    employeeRepository = module.get(getRepositoryToken(Employees));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all samples', async () => {
      const samples = [
        {
          id: 1,
          protocol: 'PROTO-123',
        },
      ];

      sampleRepository.find.mockResolvedValue(samples as Sample[]);

      const result = await service.findAll();

      expect(result).toEqual(samples);

      expect(sampleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one sample', async () => {
      const sample = {
        id: 1,
        protocol: 'PROTO-123',
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      const result = await service.findOne(1);

      expect(result).toEqual(sample);

      expect(sampleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('findByProtocol', () => {
    it('should return sample by protocol', async () => {
      const sample = {
        id: 1,
        protocol: 'PROTO-123',
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      const result = await service.findByProtocol('PROTO-123');

      expect(result).toEqual(sample);

      expect(sampleRepository.findOne).toHaveBeenCalledWith({
        where: {
          protocol: 'PROTO-123',
        },
        relations: ['examType'],
      });
    });

    it('should throw if sample not found', async () => {
      sampleRepository.findOne.mockResolvedValue(null);

      await expect(service.findByProtocol('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a sample', async () => {
      const dto = {
        examTypeId: 1,
        researcherId: 1,
        scheduledAt: '2026-05-12T10:00:00.000Z',
      };

      const examType = {
        id: 1,
        name: 'Blood Test',
      };

      const researcher = {
        id: 1,
        name: 'Samuel',
      };

      const createdSample = {
        id: 1,
        protocol: 'PROTO-123',
        examType,
        researcher: researcher,
      };

      examTypeRepository.findOne.mockResolvedValue(examType as ExamType);

      researcherRepository.findOne.mockResolvedValue(researcher as Researchers);

      sampleRepository.create.mockReturnValue(createdSample as Sample);

      sampleRepository.save.mockResolvedValue(createdSample as Sample);

      const result = await service.create(dto);

      expect(result).toEqual(createdSample);

      expect(examTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: dto.examTypeId },
      });

      expect(researcherRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: dto.researcherId,
        },
      });

      expect(sampleRepository.create).toHaveBeenCalled();

      expect(sampleRepository.save).toHaveBeenCalledWith(createdSample);
    });

    it('should throw if exam type not found', async () => {
      examTypeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          examTypeId: 1,
          researcherId: 1,
          scheduledAt: '2026-05-12T10:00:00.000Z',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if researcher not found', async () => {
      examTypeRepository.findOne.mockResolvedValue({
        id: 1,
      });

      researcherRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          examTypeId: 1,
          researcherId: 1,
          scheduledAt: '2026-05-12T10:00:00.000Z',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('approveSample', () => {
    it('should approve sample', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
      };

      const employee = {
        id: 1,
        name: 'Admin',
      };

      const savedSample = {
        ...sample,
        approvalStatus: ApprovalStatus.APPROVED,
        approvedBy: employee,
      };

      sampleRepository.findOneBy.mockResolvedValue(sample as Sample);

      employeeRepository.findOneBy.mockResolvedValue(employee as Employees);

      sampleRepository.save.mockResolvedValue(savedSample as Sample);

      const result = await service.approveSample(1, true, 1);

      expect(result).toEqual(savedSample);

      expect(sampleRepository.save).toHaveBeenCalled();
    });

    it('should reject sample', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
      };

      const employee = {
        id: 1,
      };

      sampleRepository.findOneBy.mockResolvedValue(sample as Sample);

      employeeRepository.findOneBy.mockResolvedValue(employee as Employees);

      sampleRepository.save.mockResolvedValue({
        ...sample,
        approvalStatus: ApprovalStatus.REJECTED,
      });

      const result = await service.approveSample(1, false, 1);

      expect(result.approvalStatus).toBe(ApprovalStatus.REJECTED);
    });

    it('should throw if sample not found', async () => {
      sampleRepository.findOneBy.mockResolvedValue(null);

      await expect(service.approveSample(1, true, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if sample already evaluated', async () => {
      sampleRepository.findOneBy.mockResolvedValue({
        id: 1,
        approvalStatus: ApprovalStatus.APPROVED,
      });

      await expect(service.approveSample(1, true, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if employee not found', async () => {
      sampleRepository.findOneBy.mockResolvedValue({
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
      });

      employeeRepository.findOneBy.mockResolvedValue(null);

      await expect(service.approveSample(1, true, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update sample status', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.APPROVED,
        status: SampleStatus.PENDING,
      };

      const updatedSample = {
        ...sample,
        status: SampleStatus.COLLECTED,
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      sampleRepository.save.mockResolvedValue(updatedSample as Sample);

      const result = await service.updateStatus(1, SampleStatus.COLLECTED);

      expect(result).toEqual(updatedSample);

      expect(sampleRepository.save).toHaveBeenCalled();
    });

    it('should throw if sample not found', async () => {
      sampleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(1, SampleStatus.COLLECTED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if sample is not approved', async () => {
      sampleRepository.findOne.mockResolvedValue({
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
      });

      await expect(
        service.updateStatus(1, SampleStatus.COLLECTED),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete sample', async () => {
      sampleRepository.delete.mockResolvedValue({} as any);

      await service.delete(1);

      expect(sampleRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
