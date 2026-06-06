import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateSampleDto {
  @IsNotEmpty()
  @IsInt()
  readonly researchProjectId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly animalsInThisShipment: number;

  @IsDateString()
  scheduledAt: string;
}
