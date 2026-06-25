import { CheckCircle, Clock, XCircle } from "lucide-react";

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
  [ApprovalStatus.APPROVED]: "outline",
  [ApprovalStatus.REJECTED]: "outline",
};

export const statusClass: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]:
    "border-warning/50 bg-warning/10 text-warning-foreground font-semibold dark:text-warning",
  [ApprovalStatus.APPROVED]:
    "border-success/50 bg-success/15 text-success font-semibold",
  [ApprovalStatus.REJECTED]:
    "border-destructive/50 bg-destructive/10 text-destructive font-semibold",
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

export const StatusIcon: Record<
  ApprovalStatus,
  React.ComponentType<{ className?: string }>
> = {
  [ApprovalStatus.PENDING]: Clock,
  [ApprovalStatus.APPROVED]: CheckCircle,
  [ApprovalStatus.REJECTED]: XCircle,
};

export const researchLevelLabel: Record<string, string> = {
  SCIENTIFIC_INITIATION: "Iniciação Científica",
  MASTERS: "Mestrado",
  DOCTORATE: "Doutorado",
  POST_DOCTORATE: "Pós-Doutorado",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatarData(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return dateFormatter.format(new Date(date));
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
