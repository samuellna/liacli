"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  Plus,
  Beaker,
  Layers,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllExamTypes } from "@/api/exams";
import type { ExamType } from "@/api/types";

function ExameCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 size-9 shrink-0 rounded-lg" />
          <Skeleton className="mt-1 h-4 w-3/4 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function totalParametros(exame: ExamType): number {
  if (!exame.grupos) return 0;
  return exame.grupos.reduce((acc, g) => acc + g.parametros.length, 0);
}

export default function ExamesPage() {
  const [exames, setExames] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(exames.length / itemsPerPage);

  async function loadExames() {
    setError(null);
    setIsLoading(true);
    try {
      const data = await findAllExamTypes();
      setExames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar exames.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExames();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExames = exames.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <FlaskConical className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate">
              Exames
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gerencie o catálogo de exames do laboratório.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!isLoading && !error && (
            <Badge
              variant="secondary"
              className="shrink-0 gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <FlaskConical className="size-3.5" />
              {exames.length} exames cadastrados
            </Badge>
          )}
          <Button asChild size="sm" className="shrink-0 gap-1.5">
            <Link href="/exames/cadastro">
              <Plus className="size-4" />
              Novo exame
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExameCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <AlertCircle className="size-10 text-destructive/50" />
          <p className="text-sm font-medium text-foreground">
            Não foi possível carregar os exames
          </p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={loadExames}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && exames.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <FlaskConical className="size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">
            Nenhum exame cadastrado
          </p>
          <p className="text-xs text-muted-foreground">
            Cadastre o primeiro exame para vê-lo aqui.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && currentExames.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentExames.map((exame) => {
            const nGrupos = exame.grupos?.length ?? 0;
            const nParams = totalParametros(exame);

            return (
              <Link key={exame.id} href={`/exames/${exame.id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl">
                <Card className="flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:shadow-md group-focus-visible:border-accent/40">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    {/* Nome */}
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                        <FlaskConical className="size-4" />
                      </span>
                      <h3 className="min-w-0 pt-1 text-sm font-semibold leading-snug text-foreground line-clamp-2">
                        {exame.name}
                      </h3>
                    </div>

                    {/* Descrição */}
                    {exame.description && (
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {exame.description}
                      </p>
                    )}

                    {/* Material */}
                    {exame.material && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Beaker className="size-3.5 shrink-0" />
                        <span className="truncate">{exame.material}</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>{new Date(exame.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>

                      {nGrupos > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Layers className="size-3.5 shrink-0" />
                          <span>
                            {nGrupos} {nGrupos === 1 ? "grupo" : "grupos"} · {nParams}{" "}
                            {nParams === 1 ? "parâmetro" : "parâmetros"}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="min-w-28 text-center text-sm text-muted-foreground">
            Página{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            de <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      )}
    </div>
  );
}
