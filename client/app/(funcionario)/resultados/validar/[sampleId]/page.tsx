"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
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
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
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
    <div className="rounded-md border">
      {group.groupName && (
        <div className="border-b bg-muted/40 px-4 py-2.5">
          <p className="text-sm font-semibold">{group.groupName}</p>
        </div>
      )}
      <div className="divide-y">
        {group.parameters.map((param) => (
          <div
            key={param.name}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="text-sm font-medium">{param.name}</p>
              {param.reference && (
                <p className="text-xs text-muted-foreground">
                  Ref: {param.reference}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">
                {values[param.name] || "—"}
              </span>
              {param.unit && param.unit !== "—" && (
                <span className="text-xs text-muted-foreground">
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
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{examType.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {hasGroups ? (
          <>
            {(examType.groups as ParameterGroups[]).map((group) => {
              const key = group.groupName ?? "";
              const values = (data[key] ?? {}) as Record<string, string>;
              return <GroupDisplay key={key} group={group} values={values} />;
            })}
          </>
        ) : (
          <div className="rounded-md border px-4 py-3">
            <p className="text-xs text-muted-foreground">Resultado</p>
            <p className="mt-0.5 font-mono text-sm font-semibold">
              {(data.resultado as string) || "—"}
            </p>
          </div>
        )}

        {observations && (
          <div className="rounded-md bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              Observações
            </p>
            <p className="mt-1 text-sm">{observations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="border-b">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="grid gap-4 pt-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="flex justify-end gap-3">
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
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Validar Resultado</h1>
        </header>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="size-10 text-destructive/50" aria-hidden />
            <p className="text-sm font-medium">
              {loadError ?? "Nenhum resultado encontrado para esta amostra."}
            </p>
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
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/resultados")}
            aria-label="Voltar"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Validar Resultado</h1>
            <p className="font-mono text-sm text-muted-foreground">
              {sample.protocol}
            </p>
          </div>
        </div>
      </header>

      {/* Info cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Amostra */}
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Amostra
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4">
            <InfoField label="Protocolo" value={sample.protocol} />
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
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pesquisador
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4">
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
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Projeto de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4">
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

      <Separator />

      {/* Exam results */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Resultados dos Exames</h2>
          <Badge variant="secondary">
            {results.length} {results.length === 1 ? "exame" : "exames"}
          </Badge>
        </div>

        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isBusy}
          onClick={handleReprovar}
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
        <Button disabled={isBusy} onClick={handleAprovar}>
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
