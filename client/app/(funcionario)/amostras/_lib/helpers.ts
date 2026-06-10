import { ApprovalStatus, SampleStatus } from "@/api/types";
import type { Sample } from "@/api/types";
import type { AmostraRow, StatusAmostra } from "./types";

export const MAX_EXAMES_VISIVEIS = 2;

export const statusOptions: StatusAmostra[] = [
  "Pendente",
  "Aprovada",
  "Coletada",
  "Em análise",
  "Concluído",
  "Rejeitado",
];

export const statusVariant: Record<
  StatusAmostra,
  "secondary" | "outline" | "default" | "destructive"
> = {
  Pendente: "outline",
  Aprovada: "secondary",
  Coletada: "secondary",
  "Em análise": "secondary",
  Concluído: "default",
  Rejeitado: "destructive",
};

export const statusClass: Record<StatusAmostra, string> = {
  Pendente:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  Aprovada: "border-info/40 bg-info/15 text-info dark:text-info",
  Coletada: "border-info/40 bg-info/15 text-info dark:text-info",
  "Em análise": "border-info/40 bg-info/15 text-info dark:text-info",
  Concluído: "border-success/40 bg-success/15 text-success dark:text-success",
  Rejeitado:
    "border-destructive/40 bg-destructive/15 text-destructive dark:text-destructive",
};

function resolveStatus(sample: Sample): StatusAmostra {
  if (sample.approvalStatus === ApprovalStatus.REJECTED) return "Rejeitado";
  if (sample.approvalStatus === ApprovalStatus.PENDING) return "Pendente";
  switch (sample.status) {
    case SampleStatus.DONE:
      return "Concluído";
    case SampleStatus.ANALYZING:
      return "Em análise";
    case SampleStatus.COLLECTED:
      return "Coletada";
    default:
      return "Pendente";
  }
}

export function toAmostraRow(sample: Sample): AmostraRow {
  return {
    id: sample.id,
    protocolo: sample.protocol,
    titulo: sample.researchProject.title,
    pesquisador: sample.researchProject.researcher.name,
    exames: sample.researchProject.examTypes.map((et) => et.name),
    status: resolveStatus(sample),
    podeRegistrar:
      sample.approvalStatus === ApprovalStatus.APPROVED &&
      sample.status === SampleStatus.ANALYZING,
    podeAtualizarStatus:
      sample.approvalStatus === ApprovalStatus.APPROVED &&
      (sample.status === SampleStatus.PENDING ||
        sample.status === SampleStatus.COLLECTED),
  };
}
