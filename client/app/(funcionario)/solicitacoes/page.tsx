"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  ListFilter,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { ApprovalStatus } from "@/api/types";
import { findAllSamples, approveSample } from "@/api/samples";
import { findAllEmployees } from "@/api/employees";

import {
  toSolicitacaoRow,
  ordenarPorAgendamento,
  statusOpcoes,
  statusRotulo,
  statusVariant,
  statusClass,
} from "./_lib/helpers";
import type { SolicitacaoRow } from "./_lib/types";

// ─── Status icon map ──────────────────────────────────────────────────────────

const StatusIcon: Record<
  ApprovalStatus,
  React.ComponentType<{ className?: string }>
> = {
  [ApprovalStatus.PENDING]: Clock,
  [ApprovalStatus.APPROVED]: CheckCircle,
  [ApprovalStatus.REJECTED]: XCircle,
};

// ─── Date formatting ──────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatarData(date: Date | null): string {
  if (!date) return "—";
  return dateFormatter.format(date);
}

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

// ─── InfoRow para modais ──────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 text-sm">
      <dt className="pt-0.5 text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

// ─── Modal de Detalhes ────────────────────────────────────────────────────────

function ModalDetalhes({
  solicitacao,
  open,
  onOpenChange,
}: {
  solicitacao: SolicitacaoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!solicitacao) return null;

  const Icon = StatusIcon[solicitacao.approvalStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        {/* Header com gradiente */}
        <div className="border-b bg-linear-to-br from-primary/8 via-primary/5 to-accent/5 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight">
              Detalhes da Solicitação
            </DialogTitle>
            <DialogDescription className="mt-0.5 font-normal">
              Protocolo{" "}
              <span className="font-mono font-bold text-foreground">
                {solicitacao.protocolo}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3">
            <Badge
              variant={statusVariant[solicitacao.approvalStatus]}
              className={statusClass[solicitacao.approvalStatus]}
            >
              <Icon className="size-3.5" aria-hidden />
              {statusRotulo[solicitacao.approvalStatus]}
            </Badge>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          <section className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Pesquisador
            </h3>
            <dl className="space-y-2.5 rounded-xl border border-border/60 bg-muted/25 px-4 py-3.5">
              <InfoRow label="Nome" value={solicitacao.pesquisador} />
              <InfoRow label="E-mail" value={solicitacao.pesquisadorEmail} />
              <InfoRow
                label="Instituição"
                value={solicitacao.pesquisadorInstituicao}
              />
            </dl>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Projeto de Pesquisa
            </h3>
            <div className="rounded-xl border border-border/60 bg-muted/25 px-4 py-3.5 text-sm font-medium text-foreground">
              {solicitacao.projetoPesquisa}
            </div>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Exames Solicitados
            </h3>
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/25 px-4 py-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <FileText className="size-4 text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {solicitacao.numExames}{" "}
                  {solicitacao.numExames === 1 ? "exame" : "exames"}
                </p>
                <p className="text-xs text-muted-foreground">
                  associados ao projeto de pesquisa
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Datas
            </h3>
            <dl className="space-y-2.5 rounded-xl border border-border/60 bg-muted/25 px-4 py-3.5">
              <InfoRow
                label="Solicitação em"
                value={formatarData(solicitacao.createdAt)}
              />
              <InfoRow
                label="Agendamento"
                value={
                  <span className="font-mono font-bold tabular-nums">
                    {formatarData(solicitacao.dataAgendamento)}
                  </span>
                }
              />
            </dl>
          </section>

          {solicitacao.approvalStatus !== ApprovalStatus.PENDING && (
            <section className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Avaliação
              </h3>
              <dl className="space-y-2.5 rounded-xl border border-border/60 bg-muted/25 px-4 py-3.5">
                {solicitacao.avaliadoPor && (
                  <InfoRow
                    label="Avaliado por"
                    value={solicitacao.avaliadoPor}
                  />
                )}
                {solicitacao.avaliadoEm && (
                  <InfoRow
                    label="Avaliado em"
                    value={formatarData(solicitacao.avaliadoEm)}
                  />
                )}
              </dl>
            </section>
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t bg-muted/20 px-6 py-4">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal de Atualização ─────────────────────────────────────────────────────

function ModalAtualizar({
  solicitacao,
  open,
  onOpenChange,
  onConfirmar,
}: {
  solicitacao: SolicitacaoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (
    id: number,
    aprovado: boolean,
    observacao: string,
  ) => Promise<void>;
}) {
  const [decisao, setDecisao] = useState<"APROVAR" | "REPROVAR" | null>(null);
  const [observacao, setObservacao] = useState("");
  const [isPending, setIsPending] = useState(false);

  function handleClose(value: boolean) {
    if (!value && !isPending) {
      setDecisao(null);
      setObservacao("");
    }
    onOpenChange(value);
  }

  async function handleConfirmar() {
    if (!solicitacao || decisao === null) return;
    setIsPending(true);
    try {
      await onConfirmar(solicitacao.id, decisao === "APROVAR", observacao);
      setDecisao(null);
      setObservacao("");
    } catch {
      // erro já tratado com toast em onConfirmar
    } finally {
      setIsPending(false);
    }
  }

  if (!solicitacao) return null;

  const podeConfirmar = decisao !== null && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {/* Header com gradiente */}
        <div className="border-b bg-linear-to-br from-primary/8 via-primary/5 to-accent/5 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight">
              Avaliar Solicitação
            </DialogTitle>
            <DialogDescription className="mt-0.5">
              <span className="font-mono font-bold text-foreground">
                {solicitacao.protocolo}
              </span>{" "}
              — {solicitacao.pesquisador}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2.5">
            <Label className="text-sm font-bold text-foreground">Decisão</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecisao("APROVAR")}
                disabled={isPending}
                className={[
                  "group flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                  decisao === "APROVAR"
                    ? "border-success bg-success/10 text-success shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-success/50 hover:bg-success/5 hover:text-success",
                ].join(" ")}
              >
                <CheckCircle
                  className={[
                    "size-7 transition-transform duration-200",
                    decisao === "APROVAR"
                      ? "scale-110"
                      : "group-hover:scale-105",
                  ].join(" ")}
                  aria-hidden
                />
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => setDecisao("REPROVAR")}
                disabled={isPending}
                className={[
                  "group flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                  decisao === "REPROVAR"
                    ? "border-destructive bg-destructive/10 text-destructive shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive",
                ].join(" ")}
              >
                <XCircle
                  className={[
                    "size-7 transition-transform duration-200",
                    decisao === "REPROVAR"
                      ? "scale-110"
                      : "group-hover:scale-105",
                  ].join(" ")}
                  aria-hidden
                />
                Reprovar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="observacao"
              className="text-sm font-bold text-foreground"
            >
              Observação / Justificativa
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="observacao"
              placeholder="Adicione uma observação ou justificativa para a decisão..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={isPending}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t bg-muted/20 px-6 py-4">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirmar}
              disabled={!podeConfirmar}
              className={
                decisao === "REPROVAR"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : decisao === "APROVAR"
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : ""
              }
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Processando...
                </>
              ) : decisao === "APROVAR" ? (
                <>
                  <CheckCircle className="size-4" aria-hidden />
                  Confirmar aprovação
                </>
              ) : decisao === "REPROVAR" ? (
                <>
                  <XCircle className="size-4" aria-hidden />
                  Confirmar reprovação
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
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

  const [modalDetalhes, setModalDetalhes] = useState<{
    aberto: boolean;
    solicitacao: SolicitacaoRow | null;
  }>({ aberto: false, solicitacao: null });

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

  function abrirDetalhes(solicitacao: SolicitacaoRow) {
    setModalDetalhes({ aberto: true, solicitacao });
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
                            onClick={() => abrirDetalhes(s)}
                            className="h-8 gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Eye className="size-3" aria-hidden />
                            Detalhes
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

      <ModalDetalhes
        solicitacao={modalDetalhes.solicitacao}
        open={modalDetalhes.aberto}
        onOpenChange={(aberto) =>
          setModalDetalhes((prev) => ({ ...prev, aberto }))
        }
      />

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
