export type StatusResultado = "Em validação" | "Validado";

export type ResultadoRow = {
  id: number;
  sampleId: number;
  protocolo: string;
  exames: string[];
  pesquisador: string;
  projeto: string;
  status: StatusResultado;
  podeValidar: boolean;
};
