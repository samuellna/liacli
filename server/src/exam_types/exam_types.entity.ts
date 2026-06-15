import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ExamParameter = {
  name: string;
  unit?: string;
  reference?: string;
};

export type ParameterGroups = {
  groupName?: string;
  parameters: ExamParameter[];
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
  observations: string | null;

  @Column('jsonb', { nullable: true })
  groups: ParameterGroups[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
