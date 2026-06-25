/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmployeesService } from './employees.service';
import { Employees } from './employees.entity';

import * as admin from 'firebase-admin';

const mockCreateUser = jest.fn();

jest.mock('firebase-admin', () => ({
  auth: () => ({
    createUser: mockCreateUser,
  }),
}));

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: jest.Mocked<Repository<Employees>>;

  const mockEmployeesRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employees),
          useValue: mockEmployeesRepository,
        },
        {
          provide: 'FIREBASE_ADMIN',
          useValue: admin,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);

    repository = module.get(getRepositoryToken(Employees));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const employees = [
        {
          id: 1,
          name: 'Samuel',
          email: 'samuel@email.com',
          role: 'admin',
          userId: 'firebase-uid',
        },
      ];

      repository.find.mockResolvedValue(employees as Employees[]);

      const result = await service.findAll();

      expect(result).toEqual(employees);

      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an employee', async () => {
      const employee = {
        id: 1,
        name: 'Samuel',
        email: 'samuel@email.com',
        role: 'admin',
        userId: 'firebase-uid',
      };

      repository.findOneBy.mockResolvedValue(employee as Employees);

      const result = await service.findOne(1);

      expect(result).toEqual(employee);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should return null if employee does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 999,
      });
    });
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const dto = {
        name: 'Samuel',
        email: 'samuel@email.com',
        role: 'admin',
        password: '123456',
      };

      const firebaseUser = {
        uid: 'firebase-uid',
      };

      const createdEmployee = {
        id: 1,
        name: dto.name,
        email: dto.email,
        role: dto.role,
        userId: firebaseUser.uid,
      };

      mockCreateUser.mockResolvedValue(firebaseUser);

      repository.create.mockReturnValue(createdEmployee as Employees);

      repository.save.mockResolvedValue(createdEmployee as Employees);

      const result = await service.create(dto);

      expect(result).toEqual(createdEmployee);

      expect(admin.auth().createUser).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
      });

      expect(repository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        userId: firebaseUser.uid,
      });

      expect(repository.save).toHaveBeenCalledWith(createdEmployee);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const dto = {
        name: 'Updated Samuel',
      };

      const updatedEmployee = {
        id: 1,
        name: 'Updated Samuel',
        email: 'samuel@email.com',
        role: 'admin',
        userId: 'firebase-uid',
      };

      repository.update.mockResolvedValue({} as any);

      repository.findOneBy.mockResolvedValue(updatedEmployee as Employees);

      const result = await service.update(1, dto);

      expect(repository.update).toHaveBeenCalledWith(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: 1,
      });

      expect(result).toEqual(updatedEmployee);
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      repository.delete.mockResolvedValue({} as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
