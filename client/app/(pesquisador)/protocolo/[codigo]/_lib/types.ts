export type AgendamentoStatus = "pendente" | "aprovado" | "rejeitado";
export type AnaliseStatus = "aguardando" | "em_analise" | "concluido";

export interface TimelineEvent {
  id: string;
  icon: string;
  label: string;
  description?: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface SampleData {
  id: string;
  especieAnimal: string;
  totalAnimais: number;
  exames: string[];
  outroExame?: string;
  previsaoRemessas: string;
}

export interface AppointmentData {
  protocolo: string;
  agendamentoStatus: AgendamentoStatus;
  analiseStatus: AnaliseStatus;
  dataSubmissao: string;
  semana: string;
  ultimaAtualizacao: string;
  pesquisador: {
    nome: string;
    email: string;
    telefone?: string;
    orientador?: string;
    nivel: string;
    tituloProjeto: string;
    cursoPrograma?: string;
    laboratorio?: string;
  };
  amostras: SampleData[];
  observacoes?: string;
  laudoUrl?: string;
  timeline: TimelineEvent[];
}
