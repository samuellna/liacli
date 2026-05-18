"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  ListFilter,
  Search,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusAmostra = "Pendente" | "Em análise" | "Concluído";

type Amostra = {
  codigo: string;
  exame: string;
  protocolo: string;
  pesquisador: string;
  data: string;
  status: StatusAmostra;
};

const amostrasMock: Amostra[] = [
  {
    codigo: "AM001",
    exame: "Glicose",
    protocolo: "A1B2C3",
    pesquisador: "João Silva",
    data: "2026-05-10",
    status: "Em análise",
  },
  {
    codigo: "AM002",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-08",
    status: "Concluído",
  },
  {
    codigo: "AM003",
    exame: "Hemograma",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    data: "2026-05-08",
    status: "Pendente",
  },
];

const statusOptions: StatusAmostra[] = [
  "Pendente",
  "Em análise",
  "Concluído",
];

const statusVariant: Record<
  StatusAmostra,
  "secondary" | "outline" | "default"
> = {
  Pendente: "outline",
  "Em análise": "secondary",
  Concluído: "default",
};

const statusClass: Record<StatusAmostra, string> = {
  Pendente:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  "Em análise":
    "border-info/40 bg-info/15 text-info dark:text-info",
  Concluído:
    "border-success/40 bg-success/15 text-success dark:text-success",
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

export default function AmostrasPage() {
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<
    Set<StatusAmostra>
  >(new Set());

  const amostrasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return amostrasMock.filter((amostra) => {
      const passaStatus =
        statusSelecionado.size === 0 || statusSelecionado.has(amostra.status);
      if (!passaStatus) return false;
      if (!termo) return true;
      return (
        amostra.codigo.toLowerCase().includes(termo) ||
        amostra.exame.toLowerCase().includes(termo) ||
        amostra.protocolo.toLowerCase().includes(termo) ||
        amostra.pesquisador.toLowerCase().includes(termo)
      );
    });
  }, [busca, statusSelecionado]);

  function toggleStatus(status: StatusAmostra) {
    setStatusSelecionado((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  const totalFiltradas = amostrasFiltradas.length;
  const total = amostrasMock.length;
  const filtroAtivo = busca.trim().length > 0 || statusSelecionado.size > 0;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Amostras
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe os exames recebidos, seu status e cadastre resultados.
            </p>
          </div>
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs">
            <FlaskConical className="size-3.5" aria-hidden />
            {filtroAtivo
              ? `${totalFiltradas} de ${total} amostras`
              : `${total} amostras`}
          </Badge>
        </div>
      </header>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                Registro de amostras
              </CardTitle>
              <CardDescription>
                Use a busca ou filtros para localizar amostras rapidamente.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Label htmlFor="busca-amostras" className="sr-only">
                  Buscar amostras
                </Label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="busca-amostras"
                  type="search"
                  inputMode="search"
                  placeholder="Buscar por código, exame, protocolo..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  className="h-10 w-full pl-9 text-sm sm:w-72"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-10 justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <ListFilter className="size-4" aria-hidden />
                      Status
                      {statusSelecionado.size > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-5 px-1.5 text-[10px]"
                        >
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
                      onSelect={(event) => event.preventDefault()}
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
                <TableHead className="px-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Código
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Exame
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Protocolo
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Pesquisador
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Data
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Status
                </TableHead>
                <TableHead className="px-6 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {amostrasFiltradas.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                      <Search className="size-6" aria-hidden />
                      <p className="text-sm font-medium text-foreground">
                        Nenhuma amostra encontrada
                      </p>
                      <p className="text-xs">
                        Ajuste a busca ou os filtros para ver mais resultados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                amostrasFiltradas.map((amostra) => (
                  <TableRow key={amostra.codigo}>
                    <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                      {amostra.codigo}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-foreground">
                      {amostra.exame}
                    </TableCell>
                    <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                      {amostra.protocolo}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-foreground">
                      {amostra.pesquisador}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      <time dateTime={amostra.data}>
                        {formatarData(amostra.data)}
                      </time>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={statusVariant[amostra.status]}
                        className={statusClass[amostra.status]}
                      >
                        {amostra.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          console.log(
                            `Cadastrar resultado da amostra ${amostra.codigo}`
                          )
                        }
                      >
                        <ClipboardCheck className="size-3.5" aria-hidden />
                        Cadastrar resultado
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
