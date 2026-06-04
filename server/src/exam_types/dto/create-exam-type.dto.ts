import { GrupoParametros } from '../exam_types.entity';

export class CreateExamTypeDto {
  readonly name: string;
  readonly description: string;
  readonly material?: string;
  readonly observacoes?: string;
  readonly grupos?: GrupoParametros[];
}
