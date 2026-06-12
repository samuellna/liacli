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
        <Badge key={exame} variant="secondary" className="text-xs font-normal">
          {exame}
        </Badge>
      ))}
      {restantes > 0 && (
        <Badge
          variant="outline"
          className="border-dashed text-xs font-normal text-muted-foreground"
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
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              Registro de resultados
            </CardTitle>
            <CardDescription>
              {filtroAtivo
                ? `${filtrados.length} de ${resultados.length} resultados`
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-40 px-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Protocolo
              </TableHead>
              <TableHead className="w-52 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Exames
              </TableHead>
              <TableHead className="w-36 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Pesquisador
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Projeto de pesquisa
              </TableHead>
              <TableHead className="w-32 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="w-40 px-6 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                    <FileSearch
                      className="size-10 text-muted-foreground/40"
                      aria-hidden
                    />
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
                  className="align-top transition-colors"
                >
                  <TableCell className="px-6 py-5 font-mono text-xs text-muted-foreground">
                    {resultado.protocolo}
                  </TableCell>
                  <TableCell className="py-5">
                    <ExameBadges exames={resultado.exames} />
                  </TableCell>
                  <TableCell className="py-5 text-sm text-foreground">
                    {resultado.pesquisador}
                  </TableCell>
                  <TableCell className="py-5">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {resultado.projeto}
                    </p>
                  </TableCell>
                  <TableCell className="py-5">
                    <Badge
                      variant={statusVariant[resultado.status]}
                      className={statusClass[resultado.status]}
                    >
                      {resultado.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    {resultado.podeValidar ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/resultados/validar/${resultado.sampleId}`,
                          )
                        }
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
      </CardContent>
    </Card>
  );
}
