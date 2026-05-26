"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  Clock,
  FileSearch,
  Microscope,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardStatus = "Pendentes" | "Em análise" | "Concluídas";

type Solicitacao = {
  protocolo: string;
  pesquisador: string;
  tipo: string;
  status: DashboardStatus | string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusClass: Record<string, string> = {
  Pendentes: "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  "Em análise": "border-info/40 bg-info/15 text-info dark:text-info",
  "Concluídas": "border-success/40 bg-success/15 text-success dark:text-success",
};

const filterButtons: { label: string; key: keyof DashboardData["cards"]; icon: React.ComponentType<{ className?: string }>; colorClass: string }[] = [
  { label: "Pendentes", key: "pendentes", icon: Clock, colorClass: "text-warning" },
  { label: "Em análise", key: "analise", icon: Microscope, colorClass: "text-info" },
  { label: "Concluídas", key: "concluidas", icon: CheckCircle2, colorClass: "text-success" },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  title,
  value,
  icon: Icon,
  iconClass,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`size-4 ${iconClass}`} aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// ─── Skeleton de carregamento ─────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardClient({ data }: { data: DashboardData }) {
  const params = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const statusFiltro = params.get("status");
  const listaFiltrada = statusFiltro
    ? data.solicitacoes.filter((s) => s.status === statusFiltro)
    : data.solicitacoes;

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  function handleFilter(status: string) {
    if (statusFiltro === status) {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?status=${status}`);
    }
  }

  function limparFiltro() {
    router.push("/dashboard");
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6" aria-busy={isLoading}>
      {/* Filtro ativo */}
      {statusFiltro && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Filtro ativo:{" "}
            <span className="font-semibold text-foreground">{statusFiltro}</span>
          </p>
          <Button variant="outline" size="sm" onClick={limparFiltro}>
            Limpar filtro
          </Button>
        </div>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pendentes"
          value={data.cards.pendentes}
          icon={Clock}
          iconClass="text-warning"
          description="Aguardando avaliação"
        />
        <MetricCard
          title="Em análise"
          value={data.cards.analise}
          icon={Microscope}
          iconClass="text-info"
          description="Em processamento"
        />
        <MetricCard
          title="Concluídas"
          value={data.cards.concluidas}
          icon={CheckCircle2}
          iconClass="text-success"
          description="Finalizadas com sucesso"
        />
        <MetricCard
          title="Taxa de aprovação"
          value={`${data.cards.taxa}%`}
          icon={TrendingUp}
          iconClass="text-primary"
          description="Aprovações no período"
        />
      </div>

      {/* Tabela + Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de solicitações */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" aria-hidden />
              <CardTitle className="text-base font-semibold">Solicitações recentes</CardTitle>
            </div>
            <CardDescription>
              {statusFiltro
                ? `Exibindo solicitações com status "${statusFiltro}"`
                : "Todas as solicitações do período atual"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {listaFiltrada.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <FileSearch className="size-10 text-muted-foreground/40" aria-hidden />
                <p className="text-sm font-medium text-foreground">
                  Nenhuma solicitação encontrada
                </p>
                <p className="text-xs text-muted-foreground">
                  Nenhuma solicitação para o filtro selecionado.
                </p>
                <Button variant="outline" size="sm" onClick={limparFiltro}>
                  Limpar filtro
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Protocolo
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Pesquisador
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tipo
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listaFiltrada.map((item) => (
                    <TableRow key={item.protocolo}>
                      <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {item.protocolo}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-foreground">
                        {item.pesquisador}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {item.tipo}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={statusClass[item.status] ?? ""}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Filtro por status */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">Filtrar por status</CardTitle>
            <CardDescription>Clique para filtrar a tabela</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {filterButtons.map(({ label, key, icon: Icon, colorClass }) => {
              const count = data.cards[key] as number;
              const total = data.cards.pendentes + data.cards.analise + data.cards.concluidas;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              const isActive = statusFiltro === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleFilter(label)}
                  aria-pressed={isActive}
                  className={[
                    "w-full rounded-lg border-2 px-4 py-3 text-left transition-colors duration-150",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40 hover:bg-primary/5",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`flex items-center gap-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                      <Icon className={`size-4 ${colorClass}`} aria-hidden />
                      {label}
                    </span>
                    <span className={`text-sm font-bold ${colorClass}`}>{count}</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isActive ? "bg-primary" : colorClass.replace("text-", "bg-")}`}
                      style={{ width: `${percent}%` }}
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${label}: ${percent}% do total`}
                    />
                  </div>
                </button>
              );
            })}

            {statusFiltro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={limparFiltro}
                className="w-full mt-2 text-muted-foreground"
              >
                Limpar filtro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
