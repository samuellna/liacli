export enum SampleStatus {
  PENDING = "PENDING",
  COLLECTED = "COLLECTED",
  ANALYZING = "ANALYZING",
  DONE = "DONE",
  REJECTED = "REJECTED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  userId: string;
}

export interface Researcher {
  id: number;
  name: string;
  email: string;
  institution: string;
  phone: string;
  advisorName: string;
  level: string;
  createdAt: string;
  samples: Sample[];
  projects: ResearchProject[];
}

export interface ExamType {
  id: number;
  name: string;
  description: string;
  samples: Sample[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Sample {
  id: number;
  protocol: string;
  status: SampleStatus;
  approvalStatus: ApprovalStatus;
  examType: ExamType;
  researcher: Researcher;
  approvedBy: Employee | null;
  approvedAt: Date | null;
  collectedAt: Date;
  scheduledAt: Date | null;
  researchProject: ResearchProject | null;
}

export interface SampleResult {
  id: number;
  sample: Sample;
  resultData: Record<string, unknown>;
  createdAt: Date;
}

export interface ResearchProject {
  id: number;
  title: string;
  course: string;
  researchLab: string;
  animalSpecies: string;
  totalAnimals: number;
  expectedShipments: number;
  preferredDate: Date;
  researcher: Researcher;
  examTypes: ExamType[];
  samples: Sample[];
  createdAt: Date;
}
