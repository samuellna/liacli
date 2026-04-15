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
import { ResearchersService } from './researchers.service';
import { CreateResearcherDto } from './dto/create-researcher.dto';
import { UpdateResearcherDto } from './dto/update-researcher.dto';

@Controller('researchers')
export class ResearchersController {
  constructor(private readonly researchersService: ResearchersService) {}

  // Rota para obter todos os pesquisadores
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.researchersService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          message: 'Error fetching researchers',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  // Rota para criar um novo pesquisador
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() researcherDto: CreateResearcherDto) {
    try {
      return await this.researchersService.create(researcherDto);
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          message: 'Error creating researcher',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Rota para obter um pesquisador específico por ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      return await this.researchersService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher not found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Rota para atualizar um pesquisador existente
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() researcherDto: UpdateResearcherDto,
  ) {
    try {
      return await this.researchersService.update(id, researcherDto);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher not found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.researchersService.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher not found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
