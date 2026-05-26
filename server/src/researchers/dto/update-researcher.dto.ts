import { ResearchLevel } from '../researchers.entity';

export class UpdateResearcherDto {
  readonly name?: string;
  readonly email?: string;
  readonly institution?: string;
  readonly phone?: string;
  readonly advisorName?: string;
  readonly level?: ResearchLevel;
}
