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

export interface Employee {
  id: number
  name: string
  email: string
  role: string
  userId: string
}

export interface Researcher {
  id: number
  name: string
  email: string
  institution: string
  createdAt: string
}

export interface ExamType {
  id: number
  name: string
  description: string
}

export interface Sample {
  id: number
  protocol: string
  status: SampleStatus
  approvalStatus: ApprovalStatus
  examType: ExamType
  researcher: Researcher
  approvedBy: Employee | null
  approvedAt: Date | null
  collectedAt: Date
  scheduledAt: Date | null
}

export interface SampleResult {
  id: number
  sample: Sample
  resultData: Record<string, unknown>
  createdAt: Date
}