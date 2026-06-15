import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ResearchLevel {
  SCIENTIFIC_INITIATION = 'SCIENTIFIC_INITIATION',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
  POST_DOCTORATE = 'POST_DOCTORATE',
}

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

  @Column('varchar', { length: 30, nullable: false })
  phone: string;

  @Column('varchar', { name: 'advisor_name', length: 255, nullable: false })
  advisorName: string;

  @Column({ type: 'enum', enum: ResearchLevel, nullable: false })
  level: ResearchLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @OneToMany(() => ResearchProject, (project) => project.researcher)
  projects: ResearchProject[];
}
