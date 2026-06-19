"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  Plus,
  Beaker,
  Layers,
  Search,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllExamTypes } from "@/api/exams";
import type { ExamType } from "@/api/types";

const ITEMS_PER_PAGE = 6;

function totalParametros(exame: ExamType): number {
  if (!exame.groups) return 0;
  return exame.groups.reduce((acc, g) => acc + g.parameters.length, 0);
}

function ExameCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="h-0.5 w-full bg-linear-to-r from-primary/30 via-accent/20 to-transparent" />
      <div className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-1.5 pt-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function ExamesPage() {
  const [exames, setExames] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const filtered = useMemo(() => {
    if (!search.trim()) return exames;
    const q = search.toLowerCase();
    return exames.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.material ?? "").toLowerCase().includes(q),
    );
  }, [exames, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentExames = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/8 via-background to-accent/5 p-3 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/6 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-72 bg-linear-to-l from-primary/4 to-transparent" />

        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-md shadow-primary/25">
                <FlaskConical className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Exames
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Gerencie o catálogo de exames do laboratório.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && !error && (
                <Badge className="h-7 gap-1.5 border-primary/30 bg-primary/8 px-3 text-xs font-medium text-primary">
                  <FlaskConical className="size-3.5" />
                  {exames.length} {exames.length === 1 ? "exame" : "exames"}
                </Badge>
              )}
              <Button asChild size="sm" className="gap-1.5 shadow-sm">
                <Link href="/exames/cadastro">
                  <Plus className="size-4" />
                  Novo exame
                </Link>
              </Button>
            </div>
          </div>

          {/* Search — only when there are exams */}
          {!isLoading && !error && exames.length > 0 && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, material ou descrição..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-border/60 bg-background/80 pl-9 focus-visible:border-primary/50"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExameCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Não foi possível carregar os exames
            </p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadExames}
            className="gap-2"
          >
            <RefreshCw className="size-3.5" />
            Tentar novamente
          </Button>
        </div>
      )}

      {/* ── Empty — sem nenhum exame cadastrado ──────────────────────────────── */}
      {!isLoading && !error && exames.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <FlaskConical className="size-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Nenhum exame cadastrado
            </p>
            <p className="text-xs text-muted-foreground">
              Cadastre o primeiro exame para começar.
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/exames/cadastro">
              <Plus className="size-4" />
              Cadastrar exame
            </Link>
          </Button>
        </div>
      )}

      {/* ── Empty — busca sem resultados ─────────────────────────────────────── */}
      {!isLoading && !error && exames.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-muted/20 py-16 text-center">
          <Search className="size-8 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Nenhum resultado para &ldquo;{search}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground">
              Tente buscar por outro nome ou material.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleSearch("")}>
            Limpar busca
          </Button>
        </div>
      )}

      {/* ── Grid de cards ─────────────────────────────────────────────────────── */}
      {!isLoading && !error && currentExames.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentExames.map((exame) => {
            const nGrupos = exame.groups?.length ?? 0;
            const nParams = totalParametros(exame);

            return (
              <Link
                key={exame.id}
                href={`/exames/${exame.id}`}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 group-focus-visible:border-primary/40 group-focus-visible:shadow-md">
                  {/* Top accent gradient bar */}
                  <div className="h-0.5 w-full bg-linear-to-r from-primary/70 via-primary/40 to-accent/30 opacity-60 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="flex h-full flex-col gap-3 p-5">
                    {/* Icon + Name + Material */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 transition-all duration-200 group-hover:ring-primary/35">
                        <FlaskConical className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-150 group-hover:text-primary truncate">
                          {exame.name}
                        </h3>
                        {exame.material && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Beaker className="size-3 shrink-0" />
                            <span className="truncate">{exame.material}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {exame.description && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground truncate">
                        {exame.description}
                      </p>
                    )}

                    {/* Push footer to bottom */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>
                          {new Date(exame.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>

                      {nGrupos > 0 && (
                        <Badge className="gap-1 border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <Layers className="size-3" />
                          {nParams} {nParams === 1 ? "parâmetro" : "parâmetros"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Hover glow overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-primary/3 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-xl border-border/60"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers(currentPage, totalPages).map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex size-9 items-center justify-center text-sm text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page as number)}
                  className={[
                    "flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    page === currentPage
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                  ].join(" ")}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-xl border-border/60"
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
