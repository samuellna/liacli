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
import { ResearchProjectsService } from './researcher_projects.service';
import { CreateResearchProjectDto } from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';

@Controller('researcher-projects')
export class ResearchProjectsController {
  constructor(
    private readonly researchProjectsService: ResearchProjectsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.researchProjectsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('by-researcher/:researcherId')
  @HttpCode(HttpStatus.OK)
  async findByResearcher(@Param('researcherId') researcherId: number) {
    try {
      return await this.researchProjectsService.findByResearcher(researcherId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      return await this.researchProjectsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResearchProjectDto: CreateResearchProjectDto) {
    try {
      return await this.researchProjectsService.create(
        createResearchProjectDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateResearchProjectDto: UpdateResearchProjectDto,
  ) {
    try {
      return await this.researchProjectsService.update(
        id,
        updateResearchProjectDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.researchProjectsService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
