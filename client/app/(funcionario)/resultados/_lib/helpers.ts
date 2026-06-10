import type { SampleResult } from "@/api/types";
import type { ResultadoRow, StatusResultado } from "./types";

export const MAX_EXAMES_VISIVEIS = 2;

export const statusOptions: StatusResultado[] = ["Em validação", "Validado"];

export const statusVariant: Record<StatusResultado, "secondary" | "default"> = {
  "Em validação": "secondary",
  Validado: "default",
};

export const statusClass: Record<StatusResultado, string> = {
  "Em validação": "border-info/40 bg-info/15 text-info dark:text-info",
  Validado: "border-success/40 bg-success/15 text-success dark:text-success",
};

function resolveStatus(result: SampleResult): StatusResultado {
  switch (result.validated) {
    case false:
      return "Em validação";
    case true:
      return "Validado";
  }
}

export function toResultadoRow(result: SampleResult): ResultadoRow {
  return {
    id: result.id,
    protocolo: result.sample.protocol,
    exames: result.sample.researchProject.examTypes.map((et) => et.name),
    pesquisador: result.sample.researchProject.researcher.name,
    projeto: result.sample.researchProject.title,
    status: resolveStatus(result),
    podeValidar: result.validated === false,
  };
}
