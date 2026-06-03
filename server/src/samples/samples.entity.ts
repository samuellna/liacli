import { Employees } from 'src/employees/employees.entity';
import { ExamType } from 'src/exam_types/exam_types.entity';
import { ResearchProject } from 'src/researcher_projects/researcher_projects.entity';
import { Researchers } from 'src/researchers/researchers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

@Entity({ name: 'samples' })
export class Sample {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ExamType, (examType) => examType.samples)
  examType: ExamType;

  @ManyToOne(() => Researchers, (researcher) => researcher.samples)
  researcher: Researchers;

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

  @ManyToOne(() => ResearchProject, { nullable: true })
  researchProject: ResearchProject;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  collectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
