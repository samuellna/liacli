import { IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class CreateSampleResultDto {
  @IsInt()
  @IsNotEmpty()
  sampleId: number;

  @IsInt()
  @IsNotEmpty()
  examTypeId: number;

  @IsObject()
  @IsNotEmpty()
  resultData: Record<string, any>;

  observations?: string;
}
