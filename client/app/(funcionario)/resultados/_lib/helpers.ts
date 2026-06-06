import { SampleStatus } from "@/api/types";
import type { Sample } from "@/api/types";
import type { ResultadoRow, StatusResultado } from "./types";

export const MAX_EXAMES_VISIVEIS = 2;

export const statusOptions: StatusResultado[] = [
  "Aguardando",
  "Coletada",
  "Em validação",
  "Validado",
];

export const statusVariant: Record<
  StatusResultado,
  "secondary" | "outline" | "default" | "destructive"
> = {
  Aguardando: "outline",
  Coletada: "secondary",
  "Em validação": "secondary",
  Validado: "default",
};

export const statusClass: Record<StatusResultado, string> = {
  Aguardando:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  Coletada: "border-info/40 bg-info/15 text-info dark:text-info",
  "Em validação": "border-info/40 bg-info/15 text-info dark:text-info",
  Validado: "border-success/40 bg-success/15 text-success dark:text-success",
};

function resolveStatus(sample: Sample): StatusResultado {
  switch (sample.status) {
    case SampleStatus.DONE:
      return "Validado";
    case SampleStatus.ANALYZING:
      return "Em validação";
    case SampleStatus.COLLECTED:
      return "Coletada";
    default:
      return "Aguardando";
  }
}

export function toResultadoRow(sample: Sample): ResultadoRow {
  return {
    id: sample.id,
    protocolo: sample.protocol,
    exames: sample.researchProject.examTypes.map((et) => et.name),
    pesquisador: sample.researchProject.researcher.name,
    projeto: sample.researchProject.title,
    status: resolveStatus(sample),
    podeValidar: sample.status === SampleStatus.ANALYZING,
  };
}
