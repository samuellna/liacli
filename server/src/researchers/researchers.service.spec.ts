/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResearchersService } from './researchers.service';
import { Researchers } from './researchers.entity';

describe('ResearchersService', () => {
  let service: ResearchersService;
  let repository: jest.Mocked<Repository<Researchers>>;

  const mockResearchersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResearchersService,
        {
          provide: getRepositoryToken(Researchers),
          useValue: mockResearchersRepository,
        },
      ],
    }).compile();

    service = module.get<ResearchersService>(ResearchersService);

    repository = module.get(getRepositoryToken(Researchers));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all researchers', async () => {
      const researchers = [
        {
          id: 1,
          name: 'Samuel',
          email: 'samuel@email.com',
          institution: 'UFPE',
          createdAt: new Date().toISOString(),
        },
      ];

      repository.find.mockResolvedValue(researchers as Researchers[]);

      const result = await service.findAll();

      expect(result).toEqual(researchers);

      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one researcher', async () => {
      const researcher = {
        id: 1,
        name: 'Samuel',
        email: 'samuel@email.com',
        institution: 'UFPE',
        createdAt: new Date().toISOString(),
      };

      repository.findOneBy.mockResolvedValue(researcher as Researchers);

      const result = await service.findOne(1);

      expect(result).toEqual(researcher);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should return null if researcher does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 999,
      });
    });
  });

  describe('create', () => {
    it('should create a researcher', async () => {
      const dto = {
        name: 'Samuel',
        email: 'samuel@email.com',
        institution: 'UFPE',
      };

      const createdResearcher = {
        id: 1,
        ...dto,
        createdAt: new Date().toISOString(),
      };

      repository.save.mockResolvedValue(createdResearcher as Researchers);

      const result = await service.create(dto);

      expect(result).toEqual(createdResearcher);

      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a researcher', async () => {
      const dto = {
        institution: 'CIn-UFPE',
      };

      const updatedResearcher = {
        id: 1,
        name: 'Samuel',
        email: 'samuel@email.com',
        institution: 'CIn-UFPE',
        createdAt: new Date().toISOString(),
      };

      repository.update.mockResolvedValue({} as any);

      repository.findOneBy.mockResolvedValue(updatedResearcher as Researchers);

      const result = await service.update(1, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(result).toEqual(updatedResearcher);
    });
  });

  describe('delete', () => {
    it('should delete a researcher', async () => {
      repository.delete.mockResolvedValue({} as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
