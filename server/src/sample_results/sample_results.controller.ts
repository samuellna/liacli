import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  findAll(@Query('unique') unique?: string) {
    return this.resultService.findAll(unique === 'true');
  }

  @Get('sample/:sampleId')
  findBySampleId(@Param('sampleId') sampleId: number) {
    return this.resultService.findBySampleId(sampleId);
  }

  @Get(':protocol')
  find(@Param('protocol') protocol: string) {
    return this.resultService.findByProtocol(protocol);
  }

  @Patch('validate-sample/:sampleId')
  validateAllBySample(@Param('sampleId') sampleId: number) {
    return this.resultService.validateAllResultsBySample(sampleId);
  }

  @Patch('reject-sample/:sampleId')
  rejectBySample(@Param('sampleId') sampleId: number) {
    return this.resultService.rejectSampleResults(sampleId);
  }

  @Patch(':id')
  validate(@Param('id') id: number) {
    return this.resultService.validateResult(id);
  }
}
