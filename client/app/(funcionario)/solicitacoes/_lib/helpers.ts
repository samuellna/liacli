import { ApprovalStatus } from "@/api/types";
import type { Sample } from "@/api/types";
import type { SolicitacaoRow } from "./types";

export const statusOpcoes: { valor: ApprovalStatus; rotulo: string }[] = [
  { valor: ApprovalStatus.PENDING, rotulo: "Pendente" },
  { valor: ApprovalStatus.APPROVED, rotulo: "Aprovado" },
  { valor: ApprovalStatus.REJECTED, rotulo: "Rejeitado" },
];

export const statusRotulo: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: "Pendente",
  [ApprovalStatus.APPROVED]: "Aprovado",
  [ApprovalStatus.REJECTED]: "Rejeitado",
};

export const statusVariant: Record<
  ApprovalStatus,
  "outline" | "secondary" | "default"
> = {
  [ApprovalStatus.PENDING]: "outline",
  [ApprovalStatus.APPROVED]: "default",
  [ApprovalStatus.REJECTED]: "secondary",
};

export const statusClass: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  [ApprovalStatus.APPROVED]:
    "border-success/40 bg-success/15 text-success dark:text-success",
  [ApprovalStatus.REJECTED]:
    "border-destructive/40 bg-destructive/15 text-destructive dark:text-destructive",
};

export function ordenarPorAgendamento(
  lista: SolicitacaoRow[]
): SolicitacaoRow[] {
  return [...lista].sort((a, b) => {
    if (!a.dataAgendamento) return 1;
    if (!b.dataAgendamento) return -1;
    return a.dataAgendamento.getTime() - b.dataAgendamento.getTime();
  });
}

export function toSolicitacaoRow(sample: Sample): SolicitacaoRow {
  return {
    id: sample.id,
    protocolo: sample.protocol,
    pesquisador: sample.researchProject.researcher.name,
    pesquisadorEmail: sample.researchProject.researcher.email,
    pesquisadorInstituicao: sample.researchProject.researcher.institution,
    projetoPesquisa: sample.researchProject.title,
    numExames: sample.researchProject.examTypes.length,
    dataAgendamento: sample.scheduledAt ? new Date(sample.scheduledAt) : null,
    approvalStatus: sample.approvalStatus,
    avaliadoPor: sample.approvedBy?.name ?? null,
    avaliadoEm: sample.approvedAt ? new Date(sample.approvedAt) : null,
    createdAt: new Date(sample.createdAt),
  };
}
