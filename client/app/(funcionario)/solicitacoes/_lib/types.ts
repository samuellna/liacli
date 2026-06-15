import type { ApprovalStatus } from "@/api/types";

export type SolicitacaoRow = {
  id: number;
  protocolo: string;
  pesquisador: string;
  pesquisadorEmail: string;
  pesquisadorInstituicao: string;
  projetoPesquisa: string;
  numExames: number;
  dataAgendamento: Date | null;
  approvalStatus: ApprovalStatus;
  avaliadoPor: string | null;
  avaliadoEm: Date | null;
  createdAt: Date;
};
