import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return this.employeesService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          message: 'Error fetching employees',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(id: number) {
    try {
      return this.employeesService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher not found',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() employee: CreateEmployeeDto) {
    try {
      return this.employeesService.create(employee);
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: 'Error creating employee',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() employee: CreateEmployeeDto) {
    try {
      return this.employeesService.update(id, employee);
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: 'Error updating employee',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    try {
      return this.employeesService.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: 'Error deleting employee',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
