import { Sample } from 'src/samples/samples.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
