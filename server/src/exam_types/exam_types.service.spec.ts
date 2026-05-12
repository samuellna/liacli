/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExamTypesService } from './exam_types.service';
import { ExamType } from './exam_types.entity';

describe('ExamTypesService', () => {
  let service: ExamTypesService;
  let repository: jest.Mocked<Repository<ExamType>>;

  const mockExamTypesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamTypesService,
        {
          provide: getRepositoryToken(ExamType),
          useValue: mockExamTypesRepository,
        },
      ],
    }).compile();

    service = module.get<ExamTypesService>(ExamTypesService);

    repository = module.get(getRepositoryToken(ExamType));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all exam types', async () => {
      const examTypes = [
        {
          id: 1,
          name: 'Blood Test',
          description: 'Complete blood count',
        },
      ];

      repository.find.mockResolvedValue(examTypes as ExamType[]);

      const result = await service.findAll();

      expect(result).toEqual(examTypes);

      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one exam type', async () => {
      const examType = {
        id: 1,
        name: 'Blood Test',
        description: 'Complete blood count',
      };

      repository.findOneBy.mockResolvedValue(examType as ExamType);

      const result = await service.findOne(1);

      expect(result).toEqual(examType);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should return null if exam type does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 999,
      });
    });
  });

  describe('create', () => {
    it('should create an exam type', async () => {
      const dto = {
        name: 'Blood Test',
        description: 'Complete blood count',
      };

      const createdExamType = {
        id: 1,
        ...dto,
      };

      repository.save.mockResolvedValue(createdExamType as ExamType);

      const result = await service.create(dto);

      expect(result).toEqual(createdExamType);

      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an exam type', async () => {
      const dto = {
        name: 'Updated Exam',
      };

      const updatedExamType = {
        id: 1,
        name: 'Updated Exam',
        description: 'Complete blood count',
      };

      repository.update.mockResolvedValue({} as any);

      repository.findOneBy.mockResolvedValue(updatedExamType as ExamType);

      const result = await service.update(1, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(result).toEqual(updatedExamType);
    });

    it('should return null if dto is empty', async () => {
      const dto = {};

      const result = await service.update(1, dto);

      expect(result).toBeNull();

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an exam type', async () => {
      repository.delete.mockResolvedValue({} as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
