import { GrupoParametros } from '../exam_types.entity';

export class UpdateExamTypeDto {
  name?: string;
  description?: string;
  material?: string;
  observacoes?: string;
  grupos?: GrupoParametros[];
}
