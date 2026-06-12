import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { SampleResultsService } from './sample_results.service';
import { CreateSampleResultDto } from './dto/create-sample-result.dto';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('results')
export class SampleResultsController {
  constructor(
    private readonly resultService: SampleResultsService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
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

  @Get(':id/pdf')
  async generatePdf(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { sample, results } = await this.resultService.findOneForPdf(id);
    const pdfBuffer = await this.pdfService.generateResultPdf(sample, results);
    const researcherName = sample.researchProject.researcher.name.replace(
      /\s+/g,
      '_',
    );
    const filename = `resultado-${researcherName}-${sample.protocol}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': pdfBuffer.length,
    });

    return new StreamableFile(pdfBuffer);
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
