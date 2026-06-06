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

export interface ParametroExame {
  nome: string;
  unidade?: string;
  referencia?: string;
}

export interface GrupoParametros {
  nomeGrupo?: string;
  parametros: ParametroExame[];
}

export interface ExamType {
  id: number;
  name: string;
  description: string;
  material: string | null;
  observacoes: string | null;
  grupos: GrupoParametros[] | null;
  samples: Sample[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Sample {
  id: number;
  protocol: string;
  status: SampleStatus;
  approvalStatus: ApprovalStatus;
  approvedBy: Employee | null;
  approvedAt: Date | null;
  scheduledAt: Date | null;
  animalsInThisShipment: number;
  researchProject: ResearchProject;
  results?: SampleResult[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SampleResult {
  id: number;
  sample: Sample;
  examType: ExamType;
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
