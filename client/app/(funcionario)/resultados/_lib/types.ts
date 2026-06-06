export type StatusResultado =
  | "Aguardando"
  | "Coletada"
  | "Em validação"
  | "Validado";

export type ResultadoRow = {
  id: number;
  protocolo: string;
  exames: string[];
  pesquisador: string;
  projeto: string;
  status: StatusResultado;
  podeValidar: boolean;
};
