import { ParameterGroups } from '../exam_types.entity';

export class CreateExamTypeDto {
  readonly name: string;
  readonly description: string;
  readonly material?: string;
  readonly observations?: string;
  readonly groups?: ParameterGroups[];
}
