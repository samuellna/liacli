"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  ListFilter,
  Loader2,
  RefreshCw,
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

import { updateSampleStatus } from "@/api/samples";
import { SampleStatus } from "@/api/types";
import { statusClass, statusOptions, statusVariant } from "../_lib/helpers";
import type { AmostraRow, StatusAmostra } from "../_lib/types";
import { ExameBadges } from "./exame-badges";
import { toast } from "sonner";

export function AmostrasTabela({ amostras }: { amostras: AmostraRow[] }) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusSelecionado, setStatusSelecionado] = useState<
    Set<StatusAmostra>
  >(new Set());

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return amostras.filter((row) => {
      if (statusSelecionado.size > 0 && !statusSelecionado.has(row.status))
        return false;
      if (!termo) return true;
      return (
        row.protocolo.toLowerCase().includes(termo) ||
        row.pesquisador.toLowerCase().includes(termo) ||
        row.titulo.toLowerCase().includes(termo) ||
        row.exames.some((e) => e.toLowerCase().includes(termo))
      );
    });
  }, [busca, statusSelecionado, amostras]);

  function toggleStatus(status: StatusAmostra) {
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

  async function atualizarStatus(amostra: AmostraRow) {
    const nextStatus =
      amostra.status === "Pendente"
        ? SampleStatus.COLLECTED
        : SampleStatus.ANALYZING;
    setUpdatingId(amostra.id);
    try {
      await updateSampleStatus(amostra.id, nextStatus);
      toast.success(
        `Status atualizado para ${nextStatus.toString() === "COLLECTED" ? "COLETADO" : "EM ANÁLISE"} com sucesso!`,
      );
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  function cadastrarResultado(id: number) {
    setPendingId(id);
    router.push(`/resultados/cadastro/${id}`);
  }

  const filtroAtivo = busca.trim().length > 0 || statusSelecionado.size > 0;

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">
              Projetos de pesquisa
            </CardTitle>
            <CardDescription>
              {filtroAtivo
                ? `${filtradas.length} de ${amostras.length} amostras`
                : "Use a busca ou filtros para localizar projetos rapidamente."}
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
                placeholder="Buscar por protocolo, pesquisador, exame..."
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
              <TableHead className="w-48 px-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Protocolo
              </TableHead>
              <TableHead className="w-52 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Exames
              </TableHead>
              <TableHead className="w-36 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Pesquisador
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Título do projeto
              </TableHead>
              <TableHead className="w-32 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Status
              </TableHead>
              <TableHead className="w-44 px-6 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Ação
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtradas.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                    <FlaskConical
                      className="size-10 text-muted-foreground/40"
                      aria-hidden
                    />
                    <p className="text-sm font-medium text-foreground">
                      Nenhuma amostra encontrada
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
              filtradas.map((amostra) => {
                const isPending = pendingId === amostra.id;
                return (
                  <TableRow
                    key={amostra.id}
                    className="align-top transition-colors"
                  >
                    <TableCell className="px-6 py-5 font-mono text-xs text-muted-foreground">
                      {amostra.protocolo}
                    </TableCell>
                    <TableCell className="py-5">
                      <ExameBadges exames={amostra.exames} />
                    </TableCell>
                    <TableCell className="py-5 text-sm text-foreground">
                      {amostra.pesquisador}
                    </TableCell>
                    <TableCell className="py-5">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {amostra.titulo}
                      </p>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant={statusVariant[amostra.status]}
                        className={statusClass[amostra.status]}
                      >
                        {amostra.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right">
                      {amostra.podeAtualizarStatus ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={updatingId !== null || pendingId !== null}
                          aria-busy={updatingId === amostra.id}
                          onClick={() => atualizarStatus(amostra)}
                        >
                          {updatingId === amostra.id ? (
                            <>
                              <Loader2
                                className="size-3.5 animate-spin"
                                aria-hidden
                              />
                              Atualizando...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="size-3.5" aria-hidden />
                              Atualizar status
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={
                            isPending ||
                            pendingId !== null ||
                            updatingId !== null ||
                            !amostra.podeRegistrar
                          }
                          aria-busy={isPending}
                          onClick={() => cadastrarResultado(amostra.id)}
                        >
                          {isPending ? (
                            <>
                              <Loader2
                                className="size-3.5 animate-spin"
                                aria-hidden
                              />
                              Abrindo...
                            </>
                          ) : (
                            <>
                              <ClipboardCheck
                                className="size-3.5"
                                aria-hidden
                              />
                              Cadastrar resultado
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
