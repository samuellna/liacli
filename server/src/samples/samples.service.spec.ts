/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { SamplesService } from './samples.service';

import { ApprovalStatus, Sample, SampleStatus } from './samples.entity';

import { ExamType } from 'src/exam_types/exam_types.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import { Employees } from 'src/employees/employees.entity';
import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import { EmailService } from 'src/email/email.service';
import { Not, Repository } from 'typeorm';

jest.mock('src/utils/generate_protocol', () => ({
  generateProtocol: jest.fn(() => 'PROTO-123'),
}));

describe('SamplesService', () => {
  let service: SamplesService;

  let sampleRepository: jest.Mocked<Repository<Sample>>;
  let employeeRepository: jest.Mocked<Repository<Employees>>;
  let researchProjectRepository: jest.Mocked<Repository<ResearchProject>>;

  const mockSampleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    exists: jest.fn(),
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

  const mockResearchProjectRepository = {
    findOne: jest.fn(),
  };

  const mockEmailService = {
    sendApprovalEmail: jest.fn(),
    sendRejectionEmail: jest.fn(),
    sendSchedulingRequestEmail: jest.fn(),
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

        {
          provide: getRepositoryToken(ResearchProject),
          useValue: mockResearchProjectRepository,
        },

        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<SamplesService>(SamplesService);

    sampleRepository = module.get(getRepositoryToken(Sample));

    employeeRepository = module.get(getRepositoryToken(Employees));

    researchProjectRepository = module.get(getRepositoryToken(ResearchProject));
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
        relations: [
          'researchProject',
          'researchProject.researcher',
          'researchProject.examTypes',
          'approvedBy',
        ],
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
        relations: [
          'researchProject',
          'researchProject.researcher',
          'researchProject.examTypes',
          'approvedBy',
          'results',
        ],
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
    const dto = {
      researchProjectId: 1,
      animalsInThisShipment: 5,
      scheduledAt: '2026-05-12',
    };

    const researchProject = {
      id: 1,
      researcher: { id: 1, name: 'Samuel' },
    };

    it('should create a sample when the date is free', async () => {
      const createdSample = {
        id: 1,
        protocol: 'PROTO-123',
        researchProject,
      };

      researchProjectRepository.findOne.mockResolvedValue(
        researchProject as ResearchProject,
      );

      sampleRepository.exists.mockResolvedValue(false);

      sampleRepository.create.mockReturnValue(createdSample as Sample);

      sampleRepository.save.mockResolvedValue(createdSample as Sample);

      const result = await service.create(dto);

      expect(result).toEqual(createdSample);

      expect(sampleRepository.exists).toHaveBeenCalledWith({
        where: {
          scheduledAt: new Date(dto.scheduledAt),
          approvalStatus: Not(ApprovalStatus.REJECTED),
        },
      });

      expect(sampleRepository.save).toHaveBeenCalledWith(createdSample);
    });

    it('should throw if research project not found', async () => {
      researchProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a conflict if the date already has an active sample', async () => {
      researchProjectRepository.findOne.mockResolvedValue(
        researchProject as ResearchProject,
      );

      sampleRepository.exists.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);

      expect(sampleRepository.create).not.toHaveBeenCalled();
      expect(sampleRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a conflict if a concurrent request wins the race at the database level', async () => {
      researchProjectRepository.findOne.mockResolvedValue(
        researchProject as ResearchProject,
      );

      sampleRepository.exists.mockResolvedValue(false);

      sampleRepository.create.mockReturnValue({} as Sample);

      sampleRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should rethrow unrelated database errors', async () => {
      researchProjectRepository.findOne.mockResolvedValue(
        researchProject as ResearchProject,
      );

      sampleRepository.exists.mockResolvedValue(false);

      sampleRepository.create.mockReturnValue({} as Sample);

      const unrelatedError = new Error('connection lost');
      sampleRepository.save.mockRejectedValue(unrelatedError);

      await expect(service.create(dto)).rejects.toThrow(unrelatedError);
    });
  });

  describe('findActiveScheduledDates', () => {
    it('should return distinct dates of non-rejected samples', async () => {
      sampleRepository.find.mockResolvedValue([
        { scheduledAt: new Date('2026-05-12T00:00:00.000Z') },
        { scheduledAt: new Date('2026-05-12T00:00:00.000Z') },
        { scheduledAt: new Date('2026-05-19T00:00:00.000Z') },
      ] as Sample[]);

      const result = await service.findActiveScheduledDates();

      expect(result).toEqual(['2026-05-12', '2026-05-19']);

      expect(sampleRepository.find).toHaveBeenCalledWith({
        where: { approvalStatus: Not(ApprovalStatus.REJECTED) },
        select: ['scheduledAt'],
      });
    });
  });

  describe('approveSample', () => {
    const researcher = { id: 1, name: 'Samuel', email: 'samuel@lab.com' };

    it('should approve sample', async () => {
      const sample = {
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
        researchProject: { researcher },
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

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

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
        researchProject: { researcher },
      };

      const employee = {
        id: 1,
      };

      sampleRepository.findOne.mockResolvedValue(sample as Sample);

      employeeRepository.findOneBy.mockResolvedValue(employee as Employees);

      sampleRepository.save.mockResolvedValue({
        ...sample,
        approvalStatus: ApprovalStatus.REJECTED,
      });

      const result = await service.approveSample(1, false, 1);

      expect(result.approvalStatus).toBe(ApprovalStatus.REJECTED);
    });

    it('should throw if sample not found', async () => {
      sampleRepository.findOne.mockResolvedValue(null);

      await expect(service.approveSample(1, true, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if sample already evaluated', async () => {
      sampleRepository.findOne.mockResolvedValue({
        id: 1,
        approvalStatus: ApprovalStatus.APPROVED,
        researchProject: { researcher },
      } as Sample);

      await expect(service.approveSample(1, true, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if employee not found', async () => {
      sampleRepository.findOne.mockResolvedValue({
        id: 1,
        approvalStatus: ApprovalStatus.PENDING,
        researchProject: { researcher },
      } as Sample);

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
