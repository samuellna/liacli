import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employees } from './employees.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeesRepository: Repository<Employees>,
  ) {}

  async findAll(): Promise<Employees[]> {
    return this.employeesRepository.find();
  }

  async findOne(id: number): Promise<Employees | null> {
    const employee = await this.employeesRepository.findOneBy({ id });
    if (!employee) {
      return null;
    }
    return employee;
  }

  async create(employee: CreateEmployeeDto): Promise<Employees> {
    return this.employeesRepository.save(employee);
  }

  async update(
    id: number,
    employee: UpdateEmployeeDto,
  ): Promise<Employees | null> {
    await this.employeesRepository.update(id, employee);
    return this.employeesRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.employeesRepository.delete(id);
  }
}
