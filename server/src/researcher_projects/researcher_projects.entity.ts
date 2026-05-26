import { ExamType } from 'src/exam_types/exam_types.entity';
import { Sample } from 'src/samples/samples.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'researcher_projects' })
export class ResearchProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 255, nullable: true })
  course: string;

  @Column('varchar', { name: 'research_lab', length: 150, nullable: true })
  researchLab: string;

  @Column('varchar', { name: 'animal_species', length: 100, nullable: true })
  animalSpecies: string;

  @Column({ name: 'total_animals', type: 'int', nullable: true })
  totalAnimals: number;

  @Column({ name: 'expected_shipments', type: 'int', nullable: true })
  expectedShipments: number;

  @Column({ name: 'preferred_date', type: 'date', nullable: true })
  preferredDate: Date;

  @ManyToOne(() => Researchers, (r) => r.projects)
  researcher: Researchers;

  @ManyToMany(() => ExamType)
  @JoinTable()
  examTypes: ExamType[];

  @OneToMany(() => Sample, (s) => s.researchProject)
  samples: Sample[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
