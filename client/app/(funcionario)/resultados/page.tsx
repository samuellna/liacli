"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChevronDown,
  FileSearch,
  ListFilter,
  Loader2,
  Search,
  UploadCloud,
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

type StatusResultado = "Aguardando" | "Em processamento" | "Disponível";

type Resultado = {
  id: number;
  amostra: string;
  exame: string;
  protocolo: string;
  pesquisador: string;
  data: string;
  status: StatusResultado;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const resultadosMock: Resultado[] = [
  {
    id: 1,
    amostra: "AM001",
    exame: "Glicose",
    protocolo: "A1B2C3",
    pesquisador: "João Silva",
    data: "2026-05-18",
    status: "Em processamento",
  },
  {
    id: 2,
    amostra: "AM002",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-15",
    status: "Disponível",
  },
  {
    id: 3,
    amostra: "AM003",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-12",
    status: "Aguardando",
  },
  {
    id: 4,
    amostra: "AM004",
    exame: "PCR Ultrassensível",
    protocolo: "G7H8I9",
    pesquisador: "Carlos Mendes",
    data: "2026-05-10",
    status: "Disponível",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusOptions: StatusResultado[] = ["Aguardando", "Em processamento", "Disponível"];

const statusClass: Record<StatusResultado, string> = {
  Aguardando: "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  "Em processamento": "border-info/40 bg-info/15 text-info dark:text-info",
  Disponível: "border-success/40 bg-success/15 text-success dark:text-success",
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
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32 flex-1" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultadosPage() {
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [statusSelecionado, setStatusSelecionado] = useState<Set<StatusResultado>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const resultadosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return resultadosMock.filter((r) => {
      const passaStatus = statusSelecionado.size === 0 || statusSelecionado.has(r.status);
      if (!passaStatus) return false;
      if (!termo) return true;
      return (
        r.amostra.toLowerCase().includes(termo) ||
        r.exame.toLowerCase().includes(termo) ||
        r.protocolo.toLowerCase().includes(termo) ||
        r.pesquisador.toLowerCase().includes(termo)
      );
    });
  }, [busca, statusSelecionado]);

  function toggleStatus(status: StatusResultado) {
    setStatusSelecionado((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  async function publicarResultado(id: number, amostra: string) {
    setPendingId(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success(`Resultado da amostra ${amostra} publicado com sucesso.`);
    } catch {
      toast.error("Não foi possível publicar o resultado. Tente novamente.");
    } finally {
      setPendingId(null);
    }
  }

  const totalFiltrados = resultadosFiltrados.length;
  const total = resultadosMock.length;
  const filtroAtivo = busca.trim().length > 0 || statusSelecionado.size > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-7 w-28 rounded-full" />
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
              Resultados
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie e publique os resultados dos exames realizados.
            </p>
          </div>
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs">
            <Activity className="size-3.5" aria-hidden />
            {filtroAtivo
              ? `${totalFiltrados} de ${total} resultados`
              : `${total} resultados`}
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                Registro de resultados
              </CardTitle>
              <CardDescription>
                Acompanhe o andamento dos exames e publique resultados para os pesquisadores.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Label htmlFor="busca-resultados" className="sr-only">
                  Buscar resultados
                </Label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="busca-resultados"
                  type="search"
                  inputMode="search"
                  placeholder="Buscar por amostra, exame, protocolo..."
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
                <DropdownMenuContent align="end" className="w-52">
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
                  Amostra
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Exame
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Protocolo
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pesquisador
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Data
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {resultadosFiltrados.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                      <FileSearch className="size-10 text-muted-foreground/40" aria-hidden />
                      <p className="text-sm font-medium text-foreground">
                        Nenhum resultado encontrado
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
                resultadosFiltrados.map((r) => {
                  const isPending = pendingId === r.id;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                        {r.amostra}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {r.exame}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                        {r.protocolo}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-foreground">
                        {r.pesquisador}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        <time dateTime={r.data}>{formatarData(r.data)}</time>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={statusClass[r.status]}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending || pendingId !== null || r.status === "Disponível"}
                          aria-busy={isPending}
                          onClick={() => publicarResultado(r.id, r.amostra)}
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" aria-hidden />
                              Publicando...
                            </>
                          ) : (
                            <>
                              <UploadCloud className="size-3.5" aria-hidden />
                              {r.status === "Disponível" ? "Publicado" : "Publicar"}
                            </>
                          )}
                        </Button>
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
