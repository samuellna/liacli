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
import { Separator } from "@/components/ui/separator";
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
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48 flex-1" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação</DialogTitle>
          <DialogDescription>
            Protocolo{" "}
            <span className="font-mono font-medium text-foreground">
              {solicitacao.protocolo}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 overflow-y-auto px-6 pb-2 max-h-[60vh]">
          <div className="flex items-center gap-2">
            <Badge
              variant={statusVariant[solicitacao.approvalStatus]}
              className={statusClass[solicitacao.approvalStatus]}
            >
              <Icon className="size-3" aria-hidden />
              {statusRotulo[solicitacao.approvalStatus]}
            </Badge>
          </div>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pesquisador
            </h3>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="font-medium text-foreground">
                {solicitacao.pesquisador}
              </dd>
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="text-foreground">
                {solicitacao.pesquisadorEmail}
              </dd>
              <dt className="text-muted-foreground">Instituição</dt>
              <dd className="text-foreground">
                {solicitacao.pesquisadorInstituicao}
              </dd>
            </dl>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Projeto de Pesquisa
            </h3>
            <p className="text-sm text-foreground">
              {solicitacao.projetoPesquisa}
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exames solicitados ({solicitacao.numExames})
            </h3>
            <p className="text-sm text-muted-foreground">
              {solicitacao.numExames === 0
                ? "Nenhum exame associado ao projeto."
                : `${solicitacao.numExames} ${
                    solicitacao.numExames === 1
                      ? "exame associado ao projeto."
                      : "exames associados ao projeto."
                  }`}
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Datas
            </h3>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Envio da solicitação</dt>
              <dd className="text-foreground">
                {formatarData(solicitacao.createdAt)}
              </dd>
              <dt className="text-muted-foreground">Agendamento</dt>
              <dd className="font-medium text-foreground">
                {formatarData(solicitacao.dataAgendamento)}
              </dd>
            </dl>
          </section>

          {solicitacao.approvalStatus !== ApprovalStatus.PENDING && (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Avaliação
                </h3>
                <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                  {solicitacao.avaliadoPor && (
                    <>
                      <dt className="text-muted-foreground">Avaliado por</dt>
                      <dd className="text-foreground">
                        {solicitacao.avaliadoPor}
                      </dd>
                    </>
                  )}
                  {solicitacao.avaliadoEm && (
                    <>
                      <dt className="text-muted-foreground">Avaliado em</dt>
                      <dd className="text-foreground">
                        {formatarData(solicitacao.avaliadoEm)}
                      </dd>
                    </>
                  )}
                </dl>
              </section>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Solicitação</DialogTitle>
          <DialogDescription>
            Protocolo{" "}
            <span className="font-mono font-medium text-foreground">
              {solicitacao.protocolo}
            </span>{" "}
            — {solicitacao.pesquisador}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Decisão</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecisao("APROVAR")}
                disabled={isPending}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  decisao === "APROVAR"
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-background text-muted-foreground hover:border-success/50 hover:bg-success/5 hover:text-success",
                ].join(" ")}
              >
                <CheckCircle className="size-4" aria-hidden />
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => setDecisao("REPROVAR")}
                disabled={isPending}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  decisao === "REPROVAR"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-background text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive",
                ].join(" ")}
              >
                <XCircle className="size-4" aria-hidden />
                Reprovar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao" className="text-sm font-medium">
              Observação / Justificativa
              <span className="ml-1 text-xs font-normal text-muted-foreground">
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
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
                : ""
            }
            aria-busy={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Processando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
        </header>
        <TabelaSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Solicitações
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerencie as solicitações de agendamento de amostras.
              </p>
            </div>
          </div>
        </header>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="size-10 text-destructive/50" aria-hidden />
            <p className="text-sm font-medium text-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={load}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Solicitações
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as solicitações de agendamento de amostras.
            </p>
          </div>
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs">
            <FileText className="size-3.5" aria-hidden />
            {totalFiltradas !== total
              ? `${totalFiltradas} de ${total} solicitações`
              : `${total} solicitações`}
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                Registro de solicitações
              </CardTitle>
              <CardDescription>
                Por padrão exibe apenas solicitações pendentes, ordenadas por
                data de agendamento.
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 justify-between gap-2 self-start lg:self-auto"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter className="size-4" aria-hidden />
                    Filtrar status
                    {statusSelecionados.size > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1.5 text-[10px]"
                      >
                        {statusSelecionados.size}
                      </Badge>
                    )}
                  </span>
                  <ChevronDown className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOpcoes.map(({ valor, rotulo }) => (
                  <DropdownMenuCheckboxItem
                    key={valor}
                    checked={statusSelecionados.has(valor)}
                    onCheckedChange={() => toggleStatus(valor)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {rotulo}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[17%] px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Protocolo
                </TableHead>
                <TableHead className="w-[12%] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pesquisador
                </TableHead>
                <TableHead className="w-[22%] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Projeto de Pesquisa
                </TableHead>
                <TableHead className="w-[10%] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Qtd. de exames
                </TableHead>
                <TableHead className="w-[10%] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Data
                </TableHead>
                <TableHead className="w-[11%] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[20%] px-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtradas.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="size-6" aria-hidden />
                      <p className="text-sm font-medium text-foreground">
                        Nenhuma solicitação encontrada
                      </p>
                      <p className="text-xs">
                        Ajuste os filtros de status para ver mais resultados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtradas.map((s) => {
                  const Icon = StatusIcon[s.approvalStatus];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground truncate whitespace-nowrap">
                        {s.protocolo}
                      </TableCell>
                      <TableCell
                        className="py-4 text-sm font-medium text-foreground truncate"
                        title={s.pesquisador}
                      >
                        {s.pesquisador}
                      </TableCell>
                      <TableCell
                        className="py-4 text-sm text-foreground truncate"
                        title={s.projetoPesquisa}
                      >
                        {s.projetoPesquisa}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground whitespace-nowrap">
                        {s.numExames} {s.numExames === 1 ? "exame" : "exames"}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatarData(s.dataAgendamento)}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={statusVariant[s.approvalStatus]}
                          className={statusClass[s.approvalStatus]}
                        >
                          <Icon className="size-3" aria-hidden />
                          {statusRotulo[s.approvalStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {s.approvalStatus === ApprovalStatus.PENDING && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirAtualizar(s)}
                            >
                              <RefreshCw className="size-3.5" aria-hidden />
                              Atualizar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => abrirDetalhes(s)}
                          >
                            <Eye className="size-3.5" aria-hidden />
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
