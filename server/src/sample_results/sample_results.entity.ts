import { ExamType } from 'src/exam_types/exam_types.entity';
import { Sample } from 'src/samples/samples.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sample_results' })
export class SampleResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  resultData: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  observations: string | null;

  @ManyToOne(() => Sample, (sample) => sample.results, { onDelete: 'CASCADE' })
  sample: Sample;

  @ManyToOne(() => ExamType, { nullable: false })
  examType: ExamType;

  @Column({ type: 'boolean', default: false })
  validated: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
