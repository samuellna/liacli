"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  FileSearch,
  ListFilter,
  Search,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

import {
  MAX_EXAMES_VISIVEIS,
  statusClass,
  statusOptions,
  statusVariant,
} from "../_lib/helpers";
import type { ResultadoRow, StatusResultado } from "../_lib/types";

function ExameBadges({ exames }: { exames: string[] }) {
  const visiveis = exames.slice(0, MAX_EXAMES_VISIVEIS);
  const restantes = exames.length - MAX_EXAMES_VISIVEIS;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visiveis.map((exame) => (
        <Badge
          key={exame}
          variant="secondary"
          className="max-w-32 truncate border border-primary/20 bg-primary/8 text-xs font-normal text-primary/80"
          title={exame}
        >
          {exame}
        </Badge>
      ))}
      {restantes > 0 && (
        <Badge
          variant="outline"
          className="border-dashed border-border/60 text-xs font-normal text-muted-foreground"
        >
          +{restantes}
        </Badge>
      )}
    </div>
  );
}

interface ResultadosTabelaProps {
  resultados: ResultadoRow[];
}

export function ResultadosTabela({ resultados }: ResultadosTabelaProps) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<
    Set<StatusResultado>
  >(new Set());

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return resultados.filter((row) => {
      if (statusSelecionado.size > 0 && !statusSelecionado.has(row.status))
        return false;
      if (!termo) return true;
      return (
        row.protocolo.toLowerCase().includes(termo) ||
        row.pesquisador.toLowerCase().includes(termo) ||
        row.projeto.toLowerCase().includes(termo) ||
        row.exames.some((e) => e.toLowerCase().includes(termo))
      );
    });
  }, [busca, statusSelecionado, resultados]);

  function toggleStatus(status: StatusResultado) {
    setStatusSelecionado((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function limparFiltros() {
    setBusca("");
    setStatusSelecionado(new Set());
  }

  const filtroAtivo = busca.trim().length > 0 || statusSelecionado.size > 0;

  return (
    <Card className="overflow-hidden border border-border/60 bg-linear-to-r from-primary/5 via-background to-accent/5 shadow-sm">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
              Registro de resultados
            </CardTitle>
            <CardDescription className="text-xs">
              {filtroAtivo
                ? `${filtrados.length} de ${resultados.length} resultados encontrados`
                : "Acompanhe o andamento dos exames e valide os resultados."}
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
                placeholder="Buscar por protocolo, pesquisador, projeto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="h-9 w-full pl-9 text-sm sm:w-72 border-border/60 bg-background/80 focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 justify-between gap-2 border-primary/25 bg-primary/5 text-xs font-semibold text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter className="size-3.5" aria-hidden />
                    Status
                    {statusSelecionado.size > 0 && (
                      <Badge className="h-4 min-w-4 border-0 bg-primary/20 px-1 text-[10px] font-bold text-primary">
                        {statusSelecionado.size}
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
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusSelecionado.has(status)}
                    onCheckedChange={() => toggleStatus(status)}
                    onSelect={(e) => e.preventDefault()}
                    className="text-sm"
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                {statusSelecionado.size > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <button
                      type="button"
                      onClick={limparFiltros}
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
        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b-2 border-border/50 bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[12%] px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Protocolo
                </TableHead>
                <TableHead className="w-[20%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Exames
                </TableHead>
                <TableHead className="w-[15%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Pesquisador
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Projeto de pesquisa
                </TableHead>
                <TableHead className="w-[13%] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="w-[18%] px-6 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
                        <FileSearch
                          className="size-6 text-muted-foreground/50"
                          aria-hidden
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          Nenhum resultado encontrado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ajuste a busca ou os filtros para ver mais resultados.
                        </p>
                      </div>
                      {filtroAtivo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={limparFiltros}
                        >
                          Limpar filtros
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((resultado) => (
                  <TableRow
                    key={resultado.id}
                    className="border-b border-border/50 align-top transition-colors duration-100 hover:bg-primary/5"
                  >
                    <TableCell
                      className="truncate px-6 py-4 font-mono text-xs tracking-wide text-muted-foreground"
                      title={resultado.protocolo}
                    >
                      {resultado.protocolo}
                    </TableCell>
                    <TableCell className="py-4">
                      <ExameBadges exames={resultado.exames} />
                    </TableCell>
                    <TableCell
                      className="truncate py-4 text-sm font-semibold text-foreground"
                      title={resultado.pesquisador}
                    >
                      {resultado.pesquisador}
                    </TableCell>
                    <TableCell className="py-4" title={resultado.projeto}>
                      <p className="line-clamp-2 text-sm leading-snug text-foreground/75">
                        {resultado.projeto}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={statusVariant[resultado.status]}
                        className={statusClass[resultado.status]}
                      >
                        {resultado.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      {resultado.podeValidar ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/resultados/validar/${resultado.sampleId}`,
                            )
                          }
                          className="h-8 gap-1.5 text-xs font-semibold"
                        >
                          <ShieldCheck className="size-3.5" aria-hidden />
                          Validar resultado
                        </Button>
                      ) : resultado.status === "Validado" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled
                          className="h-8 gap-1.5 text-xs font-semibold"
                        >
                          <UploadCloud className="size-3.5" aria-hidden />
                          Publicar
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
