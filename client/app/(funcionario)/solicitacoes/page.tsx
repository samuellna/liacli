"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  FileText,
  ListFilter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Loader2,
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
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
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

// ─── Types ───────────────────────────────────────────────────────────────────

type AprovacaoStatus = "PENDENTE" | "APROVADO" | "REPROVADO";

type Exame = {
  nome: string;
  descricao: string;
};

type Solicitacao = {
  id: number;
  protocolo: string;
  pesquisador: {
    nome: string;
    email: string;
    instituicao: string;
  };
  exames: Exame[];
  dataAgendamento: string;
  dataEnvio: string;
  status: AprovacaoStatus;
  observacao?: string;
  avaliadoPor?: string;
  avaliadoEm?: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const solicitacoesMock: Solicitacao[] = [
  {
    id: 1,
    protocolo: "SAM-20260510-0001",
    pesquisador: {
      nome: "João Silva",
      email: "joao.silva@usp.br",
      instituicao: "Universidade de São Paulo",
    },
    exames: [
      { nome: "Glicose", descricao: "Dosagem de glicose em soro" },
      { nome: "Insulina", descricao: "Dosagem de insulina em soro" },
    ],
    dataAgendamento: "2026-05-20",
    dataEnvio: "2026-05-10",
    status: "PENDENTE",
  },
  {
    id: 2,
    protocolo: "SAM-20260508-0002",
    pesquisador: {
      nome: "Maria Souza",
      email: "maria.souza@unicamp.br",
      instituicao: "Universidade Estadual de Campinas",
    },
    exames: [{ nome: "Hemograma Completo", descricao: "Análise completa das células sanguíneas" }],
    dataAgendamento: "2026-05-22",
    dataEnvio: "2026-05-08",
    status: "PENDENTE",
  },
  {
    id: 3,
    protocolo: "SAM-20260501-0003",
    pesquisador: {
      nome: "Carlos Mendes",
      email: "c.mendes@unifesp.br",
      instituicao: "Universidade Federal de São Paulo",
    },
    exames: [
      { nome: "PCR Ultrassensível", descricao: "Proteína C-reativa de alta sensibilidade" },
      { nome: "VHS", descricao: "Velocidade de hemossedimentação" },
      { nome: "Ferritina", descricao: "Dosagem de ferritina sérica" },
    ],
    dataAgendamento: "2026-05-15",
    dataEnvio: "2026-05-01",
    status: "APROVADO",
    observacao: "Agendamento confirmado. Trazer amostras devidamente identificadas.",
    avaliadoPor: "Dr. Roberto Lima",
    avaliadoEm: "2026-05-03",
  },
  {
    id: 4,
    protocolo: "SAM-20260428-0004",
    pesquisador: {
      nome: "Ana Paula Rocha",
      email: "anapaula@fiocruz.br",
      instituicao: "Fundação Oswaldo Cruz",
    },
    exames: [{ nome: "Cultura Bacteriana", descricao: "Identificação e antibiograma" }],
    dataAgendamento: "2026-05-12",
    dataEnvio: "2026-04-28",
    status: "REPROVADO",
    observacao: "Documentação incompleta. O termo de consentimento não foi anexado.",
    avaliadoPor: "Dra. Fernanda Costa",
    avaliadoEm: "2026-04-30",
  },
  {
    id: 5,
    protocolo: "SAM-20260512-0005",
    pesquisador: {
      nome: "Lucas Ferreira",
      email: "lucas.f@ufmg.br",
      instituicao: "Universidade Federal de Minas Gerais",
    },
    exames: [
      { nome: "Vitamina D", descricao: "25-hidroxivitamina D" },
      { nome: "Cálcio Iônico", descricao: "Dosagem de cálcio ionizado" },
    ],
    dataAgendamento: "2026-05-28",
    dataEnvio: "2026-05-12",
    status: "PENDENTE",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusOpcoes: { valor: AprovacaoStatus; rotulo: string }[] = [
  { valor: "PENDENTE", rotulo: "Pendente" },
  { valor: "APROVADO", rotulo: "Aprovado" },
  { valor: "REPROVADO", rotulo: "Reprovado" },
];

const statusRotulo: Record<AprovacaoStatus, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

const statusVariant: Record<AprovacaoStatus, "outline" | "secondary" | "default"> = {
  PENDENTE: "outline",
  APROVADO: "default",
  REPROVADO: "secondary",
};

const statusClass: Record<AprovacaoStatus, string> = {
  PENDENTE: "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  APROVADO: "border-success/40 bg-success/15 text-success dark:text-success",
  REPROVADO: "border-destructive/40 bg-destructive/15 text-destructive dark:text-destructive",
};

const StatusIcon: Record<AprovacaoStatus, React.ComponentType<{ className?: string }>> = {
  PENDENTE: Clock,
  APROVADO: CheckCircle,
  REPROVADO: XCircle,
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatarData(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

function ordenarPorAgendamento(lista: Solicitacao[]): Solicitacao[] {
  return [...lista].sort(
    (a, b) =>
      new Date(a.dataAgendamento).getTime() - new Date(b.dataAgendamento).getTime()
  );
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
  solicitacao: Solicitacao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!solicitacao) return null;

  const Icon = StatusIcon[solicitacao.status];

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
              variant={statusVariant[solicitacao.status]}
              className={statusClass[solicitacao.status]}
            >
              <Icon className="size-3" aria-hidden />
              {statusRotulo[solicitacao.status]}
            </Badge>
          </div>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pesquisador
            </h3>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="font-medium text-foreground">{solicitacao.pesquisador.nome}</dd>
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="text-foreground">{solicitacao.pesquisador.email}</dd>
              <dt className="text-muted-foreground">Instituição</dt>
              <dd className="text-foreground">{solicitacao.pesquisador.instituicao}</dd>
            </dl>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exames Solicitados ({solicitacao.exames.length})
            </h3>
            <ul className="space-y-2">
              {solicitacao.exames.map((exame, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <p className="text-sm font-medium text-foreground">{exame.nome}</p>
                  <p className="text-xs text-muted-foreground">{exame.descricao}</p>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Datas
            </h3>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Envio da solicitação</dt>
              <dd className="text-foreground">
                <time dateTime={solicitacao.dataEnvio}>
                  {formatarData(solicitacao.dataEnvio)}
                </time>
              </dd>
              <dt className="text-muted-foreground">Agendamento</dt>
              <dd className="font-medium text-foreground">
                <time dateTime={solicitacao.dataAgendamento}>
                  {formatarData(solicitacao.dataAgendamento)}
                </time>
              </dd>
            </dl>
          </section>

          {solicitacao.status !== "PENDENTE" && (
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
                      <dd className="text-foreground">{solicitacao.avaliadoPor}</dd>
                    </>
                  )}
                  {solicitacao.avaliadoEm && (
                    <>
                      <dt className="text-muted-foreground">Avaliado em</dt>
                      <dd className="text-foreground">
                        <time dateTime={solicitacao.avaliadoEm}>
                          {formatarData(solicitacao.avaliadoEm)}
                        </time>
                      </dd>
                    </>
                  )}
                </dl>
                {solicitacao.observacao && (
                  <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Observação</p>
                    <p className="text-sm text-foreground">{solicitacao.observacao}</p>
                  </div>
                )}
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
  solicitacao: Solicitacao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (id: number, aprovado: boolean, observacao: string) => Promise<void>;
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
            — {solicitacao.pesquisador.nome}
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
  const [dados, setDados] = useState<Solicitacao[]>(solicitacoesMock);
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelecionados, setStatusSelecionados] = useState<Set<AprovacaoStatus>>(
    new Set(["PENDENTE"])
  );

  const [modalDetalhes, setModalDetalhes] = useState<{
    aberto: boolean;
    solicitacao: Solicitacao | null;
  }>({ aberto: false, solicitacao: null });

  const [modalAtualizar, setModalAtualizar] = useState<{
    aberto: boolean;
    solicitacao: Solicitacao | null;
  }>({ aberto: false, solicitacao: null });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtradas = useMemo(() => {
    const lista = dados.filter((s) => statusSelecionados.has(s.status));
    return ordenarPorAgendamento(lista);
  }, [dados, statusSelecionados]);

  function toggleStatus(status: AprovacaoStatus) {
    setStatusSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function abrirDetalhes(solicitacao: Solicitacao) {
    setModalDetalhes({ aberto: true, solicitacao });
  }

  function abrirAtualizar(solicitacao: Solicitacao) {
    setModalAtualizar({ aberto: true, solicitacao });
  }

  async function confirmarAtualizacao(id: number, aprovado: boolean, observacao: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      setDados((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: aprovado ? "APROVADO" : "REPROVADO",
                observacao: observacao || undefined,
                avaliadoPor: "Funcionário Atual",
                avaliadoEm: new Date().toISOString().split("T")[0],
              }
            : s
        )
      );
      setModalAtualizar({ aberto: false, solicitacao: null });

      if (aprovado) {
        toast.success("Solicitação aprovada com sucesso.");
      } else {
        toast.success("Solicitação reprovada e registrada.");
      }
    } catch {
      toast.error("Não foi possível processar. Tente novamente.");
    }
  }

  const total = dados.length;
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
                Por padrão exibe apenas solicitações pendentes, ordenadas por data de agendamento.
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

        <CardContent className="p-0">
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
                  Instituição
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Qtd. de exames
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Data do agendamento
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                  const Icon = StatusIcon[s.status];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {s.protocolo}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-foreground">
                        {s.pesquisador.nome}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {s.pesquisador.instituicao}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {s.exames.length}{" "}
                        {s.exames.length === 1 ? "exame" : "exames"}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        <time dateTime={s.dataAgendamento}>
                          {formatarData(s.dataAgendamento)}
                        </time>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={statusVariant[s.status]}
                          className={statusClass[s.status]}
                        >
                          <Icon className="size-3" aria-hidden />
                          {statusRotulo[s.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {s.status === "PENDENTE" && (
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
