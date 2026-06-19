export const dynamic = "force-dynamic";

import DashboardClient from "./DashboardClient";
import { fetchDashboard } from "@/api/dashboard";

export type SolicitacaoPendente = {
  protocolo: string;
  pesquisador: string;
  dataAgendada: string;
  primeiraVez: boolean;
};

export type DashboardData = {
  cards: {
    pendentes: number;
    aguardandoAmostras: number;
    emAnaliseLab: number;
    concluidasMes: number;
    totalMes: number;
  };
  solicitacoesPendentes: SolicitacaoPendente[];
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function getDashboardData(): Promise<DashboardData> {
  const raw = await fetchDashboard();
  const { inAnalysis, pendingApproval, approvedPendingCollection, finished } =
    raw.samples;

  return {
    cards: {
      pendentes: pendingApproval,
      aguardandoAmostras: approvedPendingCollection,
      emAnaliseLab: inAnalysis,
      concluidasMes: finished,
      totalMes:
        inAnalysis + pendingApproval + approvedPendingCollection + finished,
    },
    solicitacoesPendentes: raw.pendingApproval.slice(0, 5).map((s) => ({
      protocolo: s.protocol,
      pesquisador: s.researcher,
      dataAgendada: formatDate(s.date),
      primeiraVez: s.firstTime,
    })),
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
