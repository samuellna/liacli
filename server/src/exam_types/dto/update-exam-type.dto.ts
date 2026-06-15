import { ParameterGroups } from '../exam_types.entity';

export class UpdateExamTypeDto {
  name?: string;
  description?: string;
  material?: string;
  observations?: string;
  groups?: ParameterGroups[];
}
