import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateSampleResultDto {
  @IsNumber()
  @IsNotEmpty()
  sampleId: number;

  @IsObject()
  @IsNotEmpty()
  resultData: Record<string, any>;
}
