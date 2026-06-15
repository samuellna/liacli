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
      throw new HttpException(
        {
          status: 500,
          message: 'Error fetching researchers projects',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Get('finalized')
  @HttpCode(HttpStatus.OK)
  async findAllFinalized() {
    try {
      return await this.researchProjectsService.findAllFinalized();
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          message: 'Error fetching finalized researchers projects',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Get('by-researcher/:researcherId')
  @HttpCode(HttpStatus.OK)
  async findByResearcher(@Param('researcherId') researcherId: number) {
    try {
      return await this.researchProjectsService.findByResearcher(researcherId);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher project not found by researcher ID',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      return await this.researchProjectsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Researcher project not found by ID',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
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
        {
          status: 400,
          message: 'Error creating researchers project',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
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
        {
          status: 500,
          message: 'Error updating researchers project',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    try {
      await this.researchProjectsService.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          status: 404,
          message: 'Error deleting researchers project, not found by ID',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
