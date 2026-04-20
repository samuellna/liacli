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
} from '@nestjs/common';
import { SamplesService } from './samples.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { SampleStatus } from './samples.entity';

@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.samplesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return await this.samplesService.findOne(id);
  }

  @Get('protocol/:protocol')
  @HttpCode(HttpStatus.OK)
  async findByProtocol(@Param('protocol') protocol: string) {
    return await this.samplesService.findByProtocol(protocol);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSampleDto: CreateSampleDto) {
    return await this.samplesService.create(createSampleDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() status: SampleStatus) {
    return await this.samplesService.updateStatus(id, status);
  }

  @Patch('approve/:id')
  approve(
    @Param('id') id: number,
    @Body() body: { approved: boolean; employeeId: number },
  ) {
    return this.samplesService.approveSample(
      id,
      body.approved,
      body.employeeId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.samplesService.delete(id);
  }
}
