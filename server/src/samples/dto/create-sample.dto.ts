import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSampleDto {
  @IsNotEmpty()
  @IsNumber()
  readonly examTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly researcherId: number;

  @IsDateString()
  scheduledAt: string; // ISO string
}
