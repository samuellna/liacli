import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExamTypesService } from './exam_types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('exams')
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.examTypesService.findAll();
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async findByName(@Query('name') name: string) {
    return await this.examTypesService.findByName(name);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return await this.examTypesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return await this.examTypesService.create(createExamTypeDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateExamTypeDto: UpdateExamTypeDto,
  ) {
    return await this.examTypesService.update(id, updateExamTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    await this.examTypesService.delete(id);
  }
}
