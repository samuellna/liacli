import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SampleResultsService } from './sample_results.service';
import { CreateSampleResultDto } from './dto/create-sample-result.dto';

@Controller('results')
export class SampleResultsController {
  constructor(private readonly resultService: SampleResultsService) {}

  @Post()
  create(@Body() sampleResultDto: CreateSampleResultDto) {
    return this.resultService.create(
      sampleResultDto.sampleId,
      sampleResultDto.resultData,
    );
  }

  @Get(':protocol')
  find(@Param('protocol') protocol: string) {
    return this.resultService.findByProtocol(protocol);
  }
}
