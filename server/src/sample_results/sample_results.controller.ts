import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SampleResultsService } from './sample_results.service';
import { CreateSampleResultDto } from './dto/create-sample-result.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('results')
export class SampleResultsController {
  constructor(private readonly resultService: SampleResultsService) {}

  @Post()
  // @UseGuards(AuthGuard)
  create(@Body() sampleResultDto: CreateSampleResultDto) {
    return this.resultService.create(
      sampleResultDto.sampleId,
      sampleResultDto.examTypeId,
      sampleResultDto.resultData,
    );
  }

  @Get()
  findAll() {
    return this.resultService.findAll();
  }

  @Get(':protocol')
  find(@Param('protocol') protocol: string) {
    return this.resultService.findByProtocol(protocol);
  }

  @Patch(':id')
  validate(@Param('id') id: number) {
    return this.resultService.validateResult(id);
  }
}
