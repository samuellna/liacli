import { Sample } from 'src/samples/samples.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sample_results' })
export class SampleResult {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Sample, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sampleId' })
  sample: Sample;

  @Column({ type: 'json' })
  resultData: Record<string, any>;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
