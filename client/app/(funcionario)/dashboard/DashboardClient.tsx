"use client";

import Link from "next/link";

import type { DashboardData } from "./page";

// ─── Constants ────────────────────────────────────────────────────────────────

const statusDistConfig: {
  label: string;
  key: keyof Pick<
    DashboardData["cards"],
    "pendentes" | "aguardandoAmostras" | "emAnaliseLab" | "concluidasMes"
  >;
  dotClass: string;
  barClass: string;
}[] = [
  {
    label: "Pendentes",
    key: "pendentes",
    dotClass: "bg-warning",
    barClass: "bg-warning",
  },
  {
    label: "Aguardando amostras",
    key: "aguardandoAmostras",
    dotClass: "bg-info",
    barClass: "bg-info",
  },
  {
    label: "Em análise",
    key: "emAnaliseLab",
    dotClass: "bg-accent",
    barClass: "bg-accent",
  },
  {
    label: "Concluídas",
    key: "concluidasMes",
    dotClass: "bg-success",
    barClass: "bg-success",
  },
];

// ─── Metric Cards ─────────────────────────────────────────────────────────────

function MetricCards({ cards }: { cards: DashboardData["cards"] }) {
  const metrics = [
    {
      label: "Pendentes",
      value: cards.pendentes,
      dotClass: "bg-warning",
      subtitle: "aguardando sua decisão",
      ariaLabel: `${cards.pendentes} solicitações pendentes`,
    },
    {
      label: "Aguardando amostras",
      value: cards.aguardandoAmostras,
      dotClass: "bg-info",
      subtitle: "aprovadas, amostras a caminho",
      ariaLabel: `${cards.aguardandoAmostras} solicitações aguardando amostras`,
    },
    {
      label: "Em análise lab.",
      value: cards.emAnaliseLab,
      dotClass: "bg-accent",
      subtitle: "exames em andamento",
      ariaLabel: `${cards.emAnaliseLab} solicitações em análise laboratorial`,
    },
    {
      label: "Concluídas (mês)",
      value: cards.concluidasMes,
      dotClass: "bg-success",
      subtitle: "laudos emitidos",
      ariaLabel: `${cards.concluidasMes} solicitações concluídas no mês`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-muted rounded-lg p-4"
          role="status"
          aria-label={m.ariaLabel}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className={`w-2 h-2 rounded-full ${m.dotClass}`}
              aria-hidden
            />
            <span className="text-xs text-muted-foreground">{m.label}</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Pendentes Table ──────────────────────────────────────────────────────────

function PendentesTable({
  data,
  className,
}: {
  data: DashboardData;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden ${className ?? ""}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            Pendentes — ação necessária
          </h2>
          <span
            className="bg-warning/10 text-warning-foreground text-xs rounded-full px-2 py-0.5 font-medium"
            aria-label={`${data.solicitacoesPendentes.length} solicitações pendentes`}
          >
            {data.solicitacoesPendentes.length}
          </span>
        </div>
        <Link
          href="/solicitacoes"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ver todas →
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Protocolo
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pesquisador
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Data agendada
            </th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Primeira vez
            </th>
          </tr>
        </thead>
        <tbody>
          {data.solicitacoesPendentes.map((item) => (
            <tr
              key={item.protocolo}
              className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {item.protocolo}
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {item.pesquisador}
                </p>
              </td>
              <td className="px-4 py-4 text-sm text-foreground">
                {item.dataAgendada}
              </td>
              <td className="px-6 py-4">
                {item.primeiraVez ? (
                  <span
                    className="bg-info text-accent-foreground text-xs rounded-full px-2 py-0.5"
                    aria-label="primeira visita ao laboratório"
                  >
                    1ª vez
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Retorno</span>
                )}
              </td>
            </tr>
          ))}
          {data.solicitacoesPendentes.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-10 text-center text-sm text-muted-foreground"
              >
                Nenhuma solicitação pendente
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Distribuição por Status ──────────────────────────────────────────────────

function DistribuicaoStatus({ cards }: { cards: DashboardData["cards"] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Distribuição por status
        </h2>
      </div>

      <div className="px-6 py-4 space-y-4">
        {statusDistConfig.map(({ label, key, dotClass, barClass }) => {
          const count = cards[key];
          const percent =
            cards.totalMes > 0 ? Math.round((count / cards.totalMes) * 100) : 0;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${dotClass}`}
                    aria-hidden
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <span className="text-xs font-medium text-foreground">
                  {count}
                </span>
              </div>
              <div className="bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${barClass}`}
                  style={{ width: `${percent}%` }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label}: ${percent}%`}
                />
              </div>
            </div>
          );
        })}

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total do mês</span>
          <span className="text-sm font-semibold text-foreground">
            {cards.totalMes}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Visão geral
        </h1>
        <p className="text-sm text-muted-foreground">
          Tenha uma visão geral das amostras do sistema.
        </p>
      </div>
      <MetricCards cards={data.cards} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PendentesTable data={data} className="lg:col-span-2" />
        <DistribuicaoStatus cards={data.cards} />
      </div>
    </div>
  );
}
