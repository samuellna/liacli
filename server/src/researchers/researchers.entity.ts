import { Sample } from 'src/samples/samples.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'researchers' })
export class Researchers {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { length: 100, nullable: false })
  email: string;

  @Column('varchar', { length: 100, nullable: false })
  institution: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @OneToMany(() => Sample, (sample) => sample.patientOrResearcher)
  samples: Sample[];
}
