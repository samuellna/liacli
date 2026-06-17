"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { toResultadoRow } from "./_lib/helpers";
import type { ResultadoRow } from "./_lib/types";
import { ResultadosTabela } from "./_components/resultados-tabela";
import { findAllResults } from "@/api/results";

function PageHeader({ total }: { total: number }) {
  return (
    <header>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Activity className="size-5 text-primary-foreground" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Resultados
            </h1>
          </div>
          <p className="pl-13 text-sm text-muted-foreground">
            Gerencie e publique os resultados dos exames realizados.
          </p>
        </div>
        <Badge className="h-7 gap-1.5 border-primary/30 bg-primary/8 px-3 text-xs text-primary">
          <Activity className="size-3.5" aria-hidden />
          {total} {total === 1 ? "resultado" : "resultados"}
        </Badge>
      </div>
    </header>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-3.5 w-80" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
      </header>
      <Card className="overflow-hidden border border-border/60 shadow-sm">
        <div className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3.5 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-72 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="divide-y divide-border/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={[
                "flex items-center gap-4 px-6 py-4",
                i % 2 !== 0 ? "bg-muted/20" : "",
              ].join(" ")}
            >
              <Skeleton className="h-3.5 w-32" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<ResultadoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(showLoading = true) {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await findAllResults();
      const resultados = data.map((result) => toResultadoRow(result));
      setResultados(resultados);
    } catch {
      if (showLoading) setError("Não foi possível carregar os resultados.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader total={0} />
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{error}</p>
              <p className="text-xs text-muted-foreground">
                Verifique sua conexão e tente novamente.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => load()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader total={resultados.length} />
      <ResultadosTabela resultados={resultados} />
    </div>
  );
}
