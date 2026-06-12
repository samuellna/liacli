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
          {total} resultados
        </Badge>
      </div>
    </header>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <Card>
        <div className="border-b p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-5">
              <Skeleton className="mt-0.5 h-4 w-40" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-0.5 h-4 w-28" />
              <Skeleton className="mt-0.5 h-4 flex-1" />
              <Skeleton className="mt-0.5 h-5 w-24 rounded-full" />
              <Skeleton className="mt-0.5 h-8 w-28 rounded-md" />
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
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="size-10 text-destructive/50" aria-hidden />
            <p className="text-sm font-medium text-foreground">{error}</p>
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
