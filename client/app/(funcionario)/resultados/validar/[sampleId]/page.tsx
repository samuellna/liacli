"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  findResultsBySampleId,
  rejectSampleResults,
  validateAllResultsBySample,
} from "@/api/results";
import type { ParameterGroups, SampleResult } from "@/api/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const researchLevelLabel: Record<string, string> = {
  SCIENTIFIC_INITIATION: "Iniciação Científica",
  MASTERS: "Mestrado",
  DOCTORATE: "Doutorado",
  POST_DOCTORATE: "Pós-Doutorado",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function GroupDisplay({
  group,
  values,
}: {
  group: ParameterGroups;
  values: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      {group.groupName && (
        <div className="border-b bg-primary/5 px-4 py-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
            {group.groupName}
          </p>
        </div>
      )}
      <div className="divide-y divide-border/50">
        {group.parameters.map((param) => (
          <div
            key={param.name}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/20 sm:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {param.name}
              </p>
              {param.reference && (
                <p className="text-xs text-muted-foreground">
                  Ref: {param.reference}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                {values[param.name] || "—"}
              </span>
              {param.unit && param.unit !== "—" && (
                <span className="text-xs font-medium text-muted-foreground">
                  {param.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: SampleResult }) {
  const { examType, resultData } = result;
  const data = resultData as Record<string, unknown>;
  const observations = result.observations as string | undefined;
  const hasGroups = examType.groups && examType.groups.length > 0;

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
      <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
        <CardTitle className="text-base font-semibold text-foreground">
          {examType.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5 pb-4">
        {hasGroups ? (
          <>
            {(examType.groups as ParameterGroups[]).map((group) => {
              const key = group.groupName ?? "";
              const values = (data[key] ?? {}) as Record<string, string>;
              return <GroupDisplay key={key} group={group} values={values} />;
            })}
          </>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="border-b bg-primary/5 px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
                Resultado
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-sm font-semibold text-foreground">
                {(data.resultado as string) || "—"}
              </p>
            </div>
          </div>
        )}

        {observations && (
          <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Observações
            </p>
            <p className="text-sm text-foreground/80">{observations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="overflow-hidden border border-border/60 shadow-sm"
          >
            <div className="border-b bg-primary/5 p-4">
              <Skeleton className="h-3.5 w-24" />
            </div>
            <CardContent className="grid gap-4 pt-5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
      <div className="flex justify-end gap-3 border-t pt-6">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ValidarResultadoPage() {
  const { sampleId } = useParams<{ sampleId: string }>();
  const router = useRouter();

  const [results, setResults] = useState<SampleResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const id = Number(sampleId);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setLoadError("ID de amostra inválido.");
      setIsLoading(false);
      return;
    }

    findResultsBySampleId(id)
      .then(setResults)
      .catch(() => setLoadError("Não foi possível carregar os resultados."))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleAprovar() {
    setIsApproving(true);
    try {
      await validateAllResultsBySample(id);
      toast.success("Resultado aprovado e enviado ao pesquisador.");
      router.push("/resultados");
    } catch {
      toast.error("Não foi possível aprovar o resultado. Tente novamente.");
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReprovar() {
    setIsRejecting(true);
    try {
      await rejectSampleResults(id);
      toast.success("Resultado reprovado. Amostra retornou para análise.");
      router.push("/resultados");
    } catch {
      toast.error("Não foi possível reprovar o resultado. Tente novamente.");
    } finally {
      setIsRejecting(false);
    }
  }

  if (isLoading) return <PageSkeleton />;

  if (loadError || results.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/resultados")}
              aria-label="Voltar"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
                <ShieldCheck
                  className="size-5 text-primary-foreground"
                  aria-hidden
                />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Validar Resultado
              </h1>
            </div>
          </div>
        </header>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {loadError ?? "Nenhum resultado encontrado para esta amostra."}
              </p>
              <p className="text-xs text-muted-foreground">
                Verifique o identificador e tente novamente.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/resultados")}
            >
              Voltar para resultados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sample = results[0].sample;
  const { researchProject } = sample;
  const researcher = researchProject.researcher;
  const isBusy = isApproving || isRejecting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/resultados")}
            aria-label="Voltar"
            className="shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
              <ShieldCheck
                className="size-5 text-primary-foreground"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Validar Resultado
              </h1>
              <p className="font-mono text-xs text-muted-foreground">
                {sample.protocol}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Info cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Amostra */}
        <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
          <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
              Amostra
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 pb-4">
            <InfoField label="Protocolo" value={sample.protocol} mono />
            <InfoField
              label="Data de agendamento"
              value={
                sample.scheduledAt
                  ? new Date(sample.scheduledAt).toLocaleDateString("pt-BR")
                  : null
              }
            />
            <InfoField
              label="Animais na remessa"
              value={sample.animalsInThisShipment}
            />
          </CardContent>
        </Card>

        {/* Pesquisador */}
        <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
          <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
              Pesquisador
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 pb-4">
            <InfoField label="Nome" value={researcher.name} />
            <InfoField label="E-mail" value={researcher.email} />
            <InfoField label="Instituição" value={researcher.institution} />
            <InfoField
              label="Nível"
              value={researchLevelLabel[researcher.level] ?? researcher.level}
            />
          </CardContent>
        </Card>

        {/* Projeto */}
        <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
          <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
              Projeto de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 pb-4">
            <InfoField label="Título" value={researchProject.title} />
            <InfoField label="Curso" value={researchProject.course} />
            <InfoField
              label="Laboratório"
              value={researchProject.researchLab}
            />
            <InfoField
              label="Espécie animal"
              value={researchProject.animalSpecies}
            />
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-border/50" />

      {/* Exam results */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Resultados dos Exames
          </h2>
          <Badge className="h-6 gap-1.5 border-primary/30 bg-primary/8 px-3 text-xs text-primary">
            {results.length} {results.length === 1 ? "exame" : "exames"}
          </Badge>
        </div>

        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-border/50 pt-6">
        <Button
          variant="outline"
          disabled={isBusy}
          onClick={handleReprovar}
          className="gap-2 border-destructive/30 bg-destructive/5 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
        >
          {isRejecting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Reprovando...
            </>
          ) : (
            <>
              <XCircle className="size-4" aria-hidden />
              Reprovar
            </>
          )}
        </Button>
        <Button disabled={isBusy} onClick={handleAprovar} className="gap-2">
          {isApproving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Aprovando...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" aria-hidden />
              Aprovar e enviar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
