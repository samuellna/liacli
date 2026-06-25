"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Eye,
  FileText,
  ListFilter,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ApprovalStatus } from "@/api/types";
import { findAllSamples, approveSample } from "@/api/samples";
import { findAllEmployees } from "@/api/employees";

import { ModalAtualizar } from "./_components/modal-atualizar";
import {
  toSolicitacaoRow,
  ordenarPorAgendamento,
  statusOpcoes,
  statusRotulo,
  statusVariant,
  statusClass,
  StatusIcon,
  formatarData,
} from "./_lib/helpers";
import type { SolicitacaoRow } from "./_lib/types";

// ─── Skeleton de carregamento ─────────────────────────────────────────────────

function TabelaSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm">
      <div className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-4 px-6 py-4",
                i % 2 !== 0 ? "bg-muted/20" : "",
              ].join(" ")}
            >
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-48 flex-1" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoRow[]>([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSelecionados, setStatusSelecionados] = useState<
    Set<ApprovalStatus>
  >(new Set([ApprovalStatus.PENDING]));

  const [modalAtualizar, setModalAtualizar] = useState<{
    aberto: boolean;
    solicitacao: SolicitacaoRow | null;
  }>({ aberto: false, solicitacao: null });

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const [samples, employees] = await Promise.all([
        findAllSamples(),
        findAllEmployees(),
      ]);
      setSolicitacoes(samples.map(toSolicitacaoRow));
      if (employees.length > 0) {
        setCurrentEmployeeId(employees[0].id);
      }
    } catch {
      setError("Não foi possível carregar as solicitações.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtradas = useMemo(() => {
    const lista = solicitacoes.filter((s) =>
      statusSelecionados.has(s.approvalStatus),
    );
    return ordenarPorAgendamento(lista);
  }, [solicitacoes, statusSelecionados]);

  function toggleStatus(status: ApprovalStatus) {
    setStatusSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function abrirAtualizar(solicitacao: SolicitacaoRow) {
    setModalAtualizar({ aberto: true, solicitacao });
  }

  async function confirmarAtualizacao(
    id: number,
    aprovado: boolean,
    observacao: string,
  ) {
    if (currentEmployeeId === null) {
      toast.error("Nenhum funcionário disponível para registrar a decisão.");
      throw new Error("no_employee");
    }
    try {
      await approveSample(id, {
        approved: aprovado,
        employeeId: currentEmployeeId,
        decisionReason: observacao || undefined,
      });
      const samples = await findAllSamples();
      setSolicitacoes(samples.map(toSolicitacaoRow));
      setModalAtualizar({ aberto: false, solicitacao: null });
      toast.success(
        aprovado
          ? "Solicitação aprovada com sucesso."
          : "Solicitação rejeitada e registrada.",
      );
    } catch (err) {
      if ((err as Error).message !== "no_employee") {
        toast.error(
          "Não foi possível processar a solicitação. Tente novamente.",
        );
      }
      throw err;
    }
  }

  const total = solicitacoes.length;
  const totalFiltradas = filtradas.length;

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-3.5 w-64" />
              </div>
            </div>
            <Skeleton className="h-7 w-36 rounded-full" />
          </div>
        </header>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
        <TabelaSkeleton />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
              <FileText
                className="size-5 text-primary-foreground"
                aria-hidden
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Solicitações
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerencie as solicitações de agendamento de amostras.
              </p>
            </div>
          </div>
        </header>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{error}</p>
              <p className="text-xs text-muted-foreground">
                Verifique sua conexão e tente novamente.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={load}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
                <FileText
                  className="size-5 text-primary-foreground"
                  aria-hidden
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Solicitações
              </h1>
            </div>
            <p className="pl-13 text-sm text-muted-foreground">
              Gerencie as solicitações de agendamento de amostras.
            </p>
          </div>
          <Badge className="h-7 gap-1.5 border-primary/30 bg-primary/8 px-3 text-xs text-primary">
            <FileText className="size-3.5" aria-hidden />
            {totalFiltradas !== total
              ? `${totalFiltradas} de ${total} solicitações`
              : `${total} ${total === 1 ? "solicitação" : "solicitações"}`}
          </Badge>
        </div>
      </header>

      {/* Chips de status rápido */}
      <div className="flex flex-wrap gap-2">
        {statusOpcoes.map(({ valor, rotulo }) => {
          const count = solicitacoes.filter(
            (s) => s.approvalStatus === valor,
          ).length;
          const Icon = StatusIcon[valor];
          const ativo = statusSelecionados.has(valor);
          return (
            <button
              key={valor}
              type="button"
              onClick={() => toggleStatus(valor)}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                ativo
                  ? statusClass[valor]
                  : "border-border bg-background text-muted-foreground hover:border-border hover:bg-muted/50",
              ].join(" ")}
              aria-pressed={ativo}
            >
              <Icon className="size-3.5" aria-hidden />
              {rotulo}
              <span
                className={[
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  ativo ? "bg-black/10" : "bg-muted",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card principal */}
      <Card className="overflow-hidden border border-border/60 shadow-sm bg-linear-to-r from-primary/5 via-background to-accent/5">
        {/* Header do card com gradiente */}
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                Registro de Solicitações
              </CardTitle>
              <CardDescription className="text-xs">
                Ordenadas por data de agendamento · Pendentes exibidas por
                padrão
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 justify-between gap-2 self-start border-primary/25 bg-primary/5 text-xs font-semibold text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary lg:self-auto"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter className="size-3.5" aria-hidden />
                    Filtrar status
                    {statusSelecionados.size > 0 && (
                      <Badge className="h-4 min-w-4 border-0 bg-primary/20 px-1 text-[10px] font-bold text-primary">
                        {statusSelecionados.size}
                      </Badge>
                    )}
                  </span>
                  <ChevronDown className="size-3.5" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Filtrar por status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOpcoes.map(({ valor, rotulo }) => (
                  <DropdownMenuCheckboxItem
                    key={valor}
                    checked={statusSelecionados.has(valor)}
                    onCheckedChange={() => toggleStatus(valor)}
                    onSelect={(e) => e.preventDefault()}
                    className="text-sm"
                  >
                    {rotulo}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Tabela */}
        <CardContent className="overflow-x-auto p-0">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="border-b-2 border-border/50 bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[17%] px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Protocolo
                </TableHead>
                <TableHead className="w-[14%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Pesquisador
                </TableHead>
                <TableHead className="w-[23%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Projeto
                </TableHead>
                <TableHead className="w-[9%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Exames
                </TableHead>
                <TableHead className="w-[11%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Agendamento
                </TableHead>
                <TableHead className="w-[11%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[15%] px-6 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtradas.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-20 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
                        <FileText
                          className="size-6 text-muted-foreground/50"
                          aria-hidden
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          Nenhuma solicitação encontrada
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ajuste os filtros de status para ver mais resultados.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtradas.map((s) => {
                  const Icon = StatusIcon[s.approvalStatus];
                  return (
                    <TableRow
                      key={s.id}
                      className={[
                        "border-b border-border/50 transition-colors duration-100 hover:bg-primary/5",
                      ].join(" ")}
                    >
                      {/* Protocolo */}
                      <TableCell className="px-6 py-4 font-mono text-xs tracking-wide text-muted-foreground">
                        {s.protocolo}
                      </TableCell>

                      {/* Pesquisador */}
                      <TableCell
                        className="truncate py-4 text-sm font-semibold text-foreground"
                        title={s.pesquisador}
                      >
                        {s.pesquisador}
                      </TableCell>

                      {/* Projeto */}
                      <TableCell
                        className="py-4 text-sm text-foreground/75"
                        title={s.projetoPesquisa}
                      >
                        <span className="line-clamp-2 leading-snug">
                          {s.projetoPesquisa}
                        </span>
                      </TableCell>

                      {/* Qtd. Exames */}
                      <TableCell className="py-4">
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-xs font-bold tabular-nums text-foreground">
                          {s.numExames}
                        </span>
                      </TableCell>

                      {/* Data */}
                      <TableCell className="py-4 text-sm tabular-nums text-muted-foreground">
                        {formatarData(s.dataAgendamento)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <Badge
                          variant={statusVariant[s.approvalStatus]}
                          className={statusClass[s.approvalStatus]}
                        >
                          <Icon className="size-3" aria-hidden />
                          {statusRotulo[s.approvalStatus]}
                        </Badge>
                      </TableCell>

                      {/* Ações */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.approvalStatus === ApprovalStatus.PENDING && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirAtualizar(s)}
                              className="h-8 gap-1.5 border-primary/30 bg-primary/5 text-xs font-semibold text-primary hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                            >
                              <RefreshCw className="size-3" aria-hidden />
                              Avaliar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="h-8 gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Link href={`/solicitacoes/${s.id}`}>
                              <Eye className="size-3" aria-hidden />
                              Detalhes
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ModalAtualizar
        solicitacao={modalAtualizar.solicitacao}
        open={modalAtualizar.aberto}
        onOpenChange={(aberto) =>
          setModalAtualizar((prev) => ({ ...prev, aberto }))
        }
        onConfirmar={confirmarAtualizacao}
      />
    </div>
  );
}
