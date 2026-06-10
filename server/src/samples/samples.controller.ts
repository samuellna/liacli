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
import { UpdateSampleStatusDto } from './dto/update-sample.dto';

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

  @Patch(':id/status')
  update(@Param('id') id: number, @Body() dto: UpdateSampleStatusDto) {
    return this.samplesService.updateStatus(id, dto.status);
  }

  @Patch('approve/:id')
  approve(
    @Param('id') id: number,
    @Body()
    body: { approved: boolean; employeeId: number; decisionReason?: string },
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
