"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  FileCheck2,
  FileSearch,
  ListFilter,
  Loader2,
  Search,
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusLaudo = "Rascunho" | "Em revisão" | "Emitido";

type Laudo = {
  id: number;
  numero: string;
  protocolo: string;
  pesquisador: string;
  exames: string[];
  dataEmissao: string;
  status: StatusLaudo;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const laudosMock: Laudo[] = [
  {
    id: 1,
    numero: "LAU-2026-001",
    protocolo: "A1B2C3",
    pesquisador: "João Silva",
    exames: ["Glicose", "Insulina"],
    dataEmissao: "2026-05-20",
    status: "Emitido",
  },
  {
    id: 2,
    numero: "LAU-2026-002",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    exames: ["Hemograma"],
    dataEmissao: "2026-05-18",
    status: "Em revisão",
  },
  {
    id: 3,
    numero: "LAU-2026-003",
    protocolo: "G7H8I9",
    pesquisador: "Carlos Mendes",
    exames: ["PCR Ultrassensível", "VHS", "Ferritina"],
    dataEmissao: "2026-05-15",
    status: "Rascunho",
  },
  {
    id: 4,
    numero: "LAU-2026-004",
    protocolo: "J1K2L3",
    pesquisador: "Ana Paula Rocha",
    exames: ["Vitamina D", "Cálcio Iônico"],
    dataEmissao: "2026-05-22",
    status: "Emitido",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusOptions: StatusLaudo[] = ["Rascunho", "Em revisão", "Emitido"];

const statusClass: Record<StatusLaudo, string> = {
  Rascunho: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
  "Em revisão": "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  Emitido: "border-success/40 bg-success/15 text-success dark:text-success",
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

// ─── Skeleton de carregamento ─────────────────────────────────────────────────

function TabelaSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LaudosPage() {
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [statusSelecionado, setStatusSelecionado] = useState<Set<StatusLaudo>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const laudosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return laudosMock.filter((l) => {
      const passaStatus = statusSelecionado.size === 0 || statusSelecionado.has(l.status);
      if (!passaStatus) return false;
      if (!termo) return true;
      return (
        l.numero.toLowerCase().includes(termo) ||
        l.protocolo.toLowerCase().includes(termo) ||
        l.pesquisador.toLowerCase().includes(termo) ||
        l.exames.some((e) => e.toLowerCase().includes(termo))
      );
    });
  }, [busca, statusSelecionado]);

  function toggleStatus(status: StatusLaudo) {
    setStatusSelecionado((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  async function emitirLaudo(id: number, numero: string) {
    setPendingId(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success(`Laudo ${numero} emitido com sucesso.`);
    } catch {
      toast.error("Não foi possível emitir o laudo. Tente novamente.");
    } finally {
      setPendingId(null);
    }
  }

  async function baixarLaudo(numero: string) {
    toast.success(`Download do laudo ${numero} iniciado.`);
  }

  const totalFiltrados = laudosFiltrados.length;
  const total = laudosMock.length;
  const filtroAtivo = busca.trim().length > 0 || statusSelecionado.size > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
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
              Laudos
            </h1>
            <p className="text-sm text-muted-foreground">
              Emita e gerencie os laudos dos exames realizados no laboratório.
            </p>
          </div>
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs">
            <FileCheck2 className="size-3.5" aria-hidden />
            {filtroAtivo
              ? `${totalFiltrados} de ${total} laudos`
              : `${total} laudos`}
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                Registro de laudos
              </CardTitle>
              <CardDescription>
                Emita novos laudos ou baixe laudos já disponíveis para os pesquisadores.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Label htmlFor="busca-laudos" className="sr-only">
                  Buscar laudos
                </Label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="busca-laudos"
                  type="search"
                  inputMode="search"
                  placeholder="Buscar por número, protocolo, pesquisador..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="h-10 w-full pl-9 text-sm sm:w-72"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="h-10 justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <ListFilter className="size-4" aria-hidden />
                      Status
                      {statusSelecionado.size > 0 && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                          {statusSelecionado.size}
                        </Badge>
                      )}
                    </span>
                    <ChevronDown className="size-4" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusOptions.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusSelecionado.has(status)}
                      onCheckedChange={() => toggleStatus(status)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {statusSelecionado.size > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <button
                        type="button"
                        onClick={() => setStatusSelecionado(new Set())}
                        className="w-full px-2 py-1.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Limpar filtros
                      </button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Número
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Protocolo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pesquisador
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Exames
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Data de emissão
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
              {laudosFiltrados.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                      <FileSearch className="size-10 text-muted-foreground/40" aria-hidden />
                      <p className="text-sm font-medium text-foreground">
                        Nenhum laudo encontrado
                      </p>
                      <p className="text-xs">
                        Ajuste a busca ou os filtros para ver mais resultados.
                      </p>
                      {filtroAtivo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBusca("");
                            setStatusSelecionado(new Set());
                          }}
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                laudosFiltrados.map((l) => {
                  const isPending = pendingId === l.id;
                  return (
                    <TableRow key={l.id}>
                      <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {l.numero}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                        {l.protocolo}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-foreground">
                        {l.pesquisador}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {l.exames.length === 1
                          ? l.exames[0]
                          : `${l.exames[0]} +${l.exames.length - 1}`}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        <time dateTime={l.dataEmissao}>{formatarData(l.dataEmissao)}</time>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={statusClass[l.status]}>
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {l.status !== "Emitido" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isPending || pendingId !== null}
                              aria-busy={isPending}
                              onClick={() => emitirLaudo(l.id, l.numero)}
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                                  Emitindo...
                                </>
                              ) : (
                                <>
                                  <FileCheck2 className="size-3.5" aria-hidden />
                                  Emitir
                                </>
                              )}
                            </Button>
                          )}
                          {l.status === "Emitido" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => baixarLaudo(l.numero)}
                            >
                              <Download className="size-3.5" aria-hidden />
                              Baixar
                            </Button>
                          )}
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
    </div>
  );
}
