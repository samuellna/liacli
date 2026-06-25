import { Employees } from 'src/employees/employees.entity';
import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import { SampleResult } from 'src/sample_results/sample_results.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SampleStatus {
  PENDING = 'PENDING',
  COLLECTED = 'COLLECTED',
  ANALYZING = 'ANALYZING',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Garante, a nível de banco, que um mesmo horário não possa ter dois
// agendamentos ativos simultaneamente (pendentes ou aprovados). Agendamentos
// rejeitados não contam, liberando o horário para outros pesquisadores.
@Entity({ name: 'samples' })
@Index('UQ_samples_active_scheduled_at', ['scheduledAt'], {
  unique: true,
  where: `"approvalStatus" != 'REJECTED'`,
})
export class Sample {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  protocol: string;

  @Column({ type: 'enum', enum: SampleStatus, default: SampleStatus.PENDING })
  status: SampleStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approvalStatus: ApprovalStatus;

  @ManyToOne(() => Employees, { nullable: true })
  approvedBy: Employees;

  @ManyToOne(() => ResearchProject, (p) => p.samples, { nullable: false })
  researchProject: ResearchProject;

  @Column({ type: 'int' })
  animalsInThisShipment: number;

  @OneToMany(() => SampleResult, (r) => r.sample)
  results: SampleResult[];

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
