import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ParametroExame = {
  nome: string;
  unidade?: string;
  referencia?: string;
};

export type GrupoParametros = {
  nomeGrupo?: string;
  parametros: ParametroExame[];
};

@Entity({ name: 'exam_types' })
export class ExamType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 255, nullable: true })
  material: string | null;

  @Column('text', { nullable: true })
  observacoes: string | null;

  @Column('jsonb', { nullable: true })
  grupos: GrupoParametros[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
