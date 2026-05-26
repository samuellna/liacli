import { ResearchLevel } from '../researchers.entity';

export class CreateResearcherDto {
  readonly name: string;
  readonly email: string;
  readonly institution: string;
  readonly phone?: string;
  readonly advisorName?: string;
  readonly level?: ResearchLevel;
}
