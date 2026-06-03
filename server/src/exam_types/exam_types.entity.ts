import { Sample } from 'src/samples/samples.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'exam_types' })
export class ExamType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, unique: true })
  name: string;

  @Column('text')
  description: string;

  @OneToMany(() => Sample, (sample) => sample.examType)
  samples: Sample[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
