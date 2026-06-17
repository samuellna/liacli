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
  colorVar: string;
}[] = [
  { label: "Pendentes", key: "pendentes", colorVar: "--warning" },
  {
    label: "Aguardando amostras",
    key: "aguardandoAmostras",
    colorVar: "--info",
  },
  { label: "Em análise", key: "emAnaliseLab", colorVar: "--accent" },
  { label: "Concluídas", key: "concluidasMes", colorVar: "--success" },
];

// ─── Metric Cards ─────────────────────────────────────────────────────────────

function MetricCards({ cards }: { cards: DashboardData["cards"] }) {
  const metrics = [
    {
      label: "Pendentes",
      value: cards.pendentes,
      colorVar: "--warning",
      subtitle: "aguardando sua decisão",
      ariaLabel: `${cards.pendentes} solicitações pendentes`,
    },
    {
      label: "Aguardando amostras",
      value: cards.aguardandoAmostras,
      colorVar: "--info",
      subtitle: "aprovadas, amostras a caminho",
      ariaLabel: `${cards.aguardandoAmostras} solicitações aguardando amostras`,
    },
    {
      label: "Em análise lab.",
      value: cards.emAnaliseLab,
      colorVar: "--accent",
      subtitle: "exames em andamento",
      ariaLabel: `${cards.emAnaliseLab} solicitações em análise laboratorial`,
    },
    {
      label: "Concluídas (mês)",
      value: cards.concluidasMes,
      colorVar: "--success",
      subtitle: "laudos emitidos",
      ariaLabel: `${cards.concluidasMes} solicitações concluídas no mês`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="relative bg-card rounded-xl border border-border border-t-4 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
          style={{ borderTopColor: `var(${m.colorVar})` }}
          role="status"
          aria-label={m.ariaLabel}
        >
          {/* Background glow decoration */}
          <div
            className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full opacity-[0.06] group-hover:opacity-[0.11] transition-opacity duration-300"
            style={{ background: `var(${m.colorVar})` }}
            aria-hidden
          />

          {/* Status indicator */}
          <div
            className="w-2.5 h-2.5 rounded-full mb-5"
            style={{ background: `var(${m.colorVar})` }}
            aria-hidden
          />

          {/* Metric value */}
          <p className="text-4xl font-bold text-foreground tracking-tight leading-none mb-2">
            {m.value}
          </p>

          {/* Label */}
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            {m.label}
          </p>

          {/* Subtitle */}
          <p className="text-xs text-muted-foreground/80">{m.subtitle}</p>
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
      className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-linear-to-r from-muted/40 to-transparent">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-foreground">
            Pendentes — ação necessária
          </h2>
          <span
            className="bg-warning/15 text-warning-foreground text-[11px] rounded-full px-2.5 py-0.5 font-semibold border border-warning/20"
            aria-label={`${data.solicitacoesPendentes.length} solicitações pendentes`}
          >
            {data.solicitacoesPendentes.length}
          </span>
        </div>
        <Link
          href="/solicitacoes"
          className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150 font-medium"
        >
          ver todas →
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/25">
            <th className="text-left px-6 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Protocolo
            </th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Pesquisador
            </th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Data agendada
            </th>
            <th className="text-left px-6 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Primeira vez
            </th>
          </tr>
        </thead>
        <tbody>
          {data.solicitacoesPendentes.map((item) => (
            <tr
              key={item.protocolo}
              className="border-b border-border last:border-0 hover:bg-muted/35 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                  {item.protocolo}
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-foreground">
                  {item.pesquisador}
                </p>
              </td>
              <td className="px-4 py-4 text-sm text-muted-foreground">
                {item.dataAgendada}
              </td>
              <td className="px-6 py-4">
                {item.primeiraVez ? (
                  <span
                    className="bg-info text-info-foreground text-[11px] rounded-full px-2.5 py-1 font-semibold border border-info/20"
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
                className="px-6 py-12 text-center text-sm text-muted-foreground"
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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-linear-to-r from-muted/40 to-transparent">
        <h2 className="text-sm font-semibold text-foreground">
          Distribuição por status
        </h2>
      </div>

      <div className="px-6 py-5 space-y-5">
        {statusDistConfig.map(({ label, key, colorVar }) => {
          const count = cards[key];
          const percent =
            cards.totalMes > 0 ? Math.round((count / cards.totalMes) * 100) : 0;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: `var(${colorVar})` }}
                    aria-hidden
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {count}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 w-7 text-right">
                    {percent}%
                  </span>
                </div>
              </div>
              <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    background: `linear-gradient(90deg, var(${colorVar}), color-mix(in oklch, var(${colorVar}) 55%, transparent))`,
                  }}
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

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total do mês
          </span>
          <span className="text-base font-bold text-foreground">
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
    <div className="space-y-6 max-h-screen">
      {/* Header */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Visão geral
          </h1>
        </div>
        <p className="pl-4 text-sm text-muted-foreground">
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
