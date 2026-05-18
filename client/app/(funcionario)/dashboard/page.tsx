type Solicitacao = {
  protocolo: string;
  pesquisador: string;
  tipo: string;
  status: string;
};

type DashboardData = {
  cards: {
    pendentes: number;
    analise: number;
    concluidas: number;
    taxa: number;
  };
  solicitacoes: Solicitacao[];
};

// MOCK (trocar depois pelo backend)
async function getDashboardData(): Promise<DashboardData> {
  return {
    cards: {
      pendentes: 12,
      analise: 8,
      concluidas: 156,
      taxa: 97,
    },
    solicitacoes: [
      {
        protocolo: "LIA-001",
        pesquisador: "João Mendes",
        tipo: "qPCR",
        status: "Pendentes",
      },
      {
        protocolo: "LIA-002",
        pesquisador: "Ana Costa",
        tipo: "HPLC",
        status: "Em análise",
      },
      {
        protocolo: "LIA-003",
        pesquisador: "Maria Silva",
        tipo: "NGS",
        status: "Concluídas",
      },
    ],
  };
}

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}