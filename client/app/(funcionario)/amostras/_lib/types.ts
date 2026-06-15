export type StatusAmostra =
  | "Pendente"
  | "Aprovada"
  | "Coletada"
  | "Em análise"
  | "Concluído"
  | "Rejeitado";

export type AmostraRow = {
  id: number;
  protocolo: string;
  titulo: string;
  pesquisador: string;
  exames: string[];
  status: StatusAmostra;
  podeRegistrar: boolean;
  podeAtualizarStatus: boolean;
};
