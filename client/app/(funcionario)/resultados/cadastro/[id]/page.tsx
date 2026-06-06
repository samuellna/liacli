"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ClipboardCheck,
  FlaskConical,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { findSampleById } from "@/api/samples";
import { createSampleResult } from "@/api/results";
import { ApprovalStatus, SampleStatus } from "@/api/types";
import type { ExamType, GrupoParametros, Sample } from "@/api/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type GrupoForm = Record<string, string>; // paramNome → value

type ExameFormState = {
  parametros: Record<string, GrupoForm>; // nomeGrupo → paramNome → value
  observacoes: string;
  valorGenerico: string;
};

type FormState = Record<number, ExameFormState>; // examTypeId → state

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialState(examTypes: ExamType[]): FormState {
  const state: FormState = {};
  for (const et of examTypes) {
    const parametros: Record<string, GrupoForm> = {};
    if (et.grupos) {
      for (const grupo of et.grupos) {
        const key = grupo.nomeGrupo ?? "";
        parametros[key] = {};
        for (const param of grupo.parametros) {
          parametros[key][param.nome] = "";
        }
      }
    }
    state[et.id] = { parametros, observacoes: "", valorGenerico: "" };
  }
  return state;
}

function buildResultData(
  et: ExamType,
  etForm: ExameFormState,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (et.grupos && et.grupos.length > 0) {
    for (const grupo of et.grupos) {
      const key = grupo.nomeGrupo ?? "";
      data[key] = { ...etForm.parametros[key] };
    }
  } else {
    data.resultado = etForm.valorGenerico;
  }

  if (etForm.observacoes.trim()) {
    data.observacoes = etForm.observacoes.trim();
  }

  return data;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusClass: Partial<Record<SampleStatus, string>> = {
  [SampleStatus.PENDING]:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  [SampleStatus.COLLECTED]:
    "border-info/40 bg-info/15 text-info dark:text-info",
  [SampleStatus.ANALYZING]:
    "border-info/40 bg-info/15 text-info dark:text-info",
  [SampleStatus.DONE]:
    "border-success/40 bg-success/15 text-success dark:text-success",
  [SampleStatus.REJECTED]:
    "border-destructive/40 bg-destructive/15 text-destructive dark:text-destructive",
};

const statusLabel: Partial<Record<SampleStatus, string>> = {
  [SampleStatus.PENDING]: "Pendente",
  [SampleStatus.COLLECTED]: "Coletada",
  [SampleStatus.ANALYZING]: "Em análise",
  [SampleStatus.DONE]: "Concluído",
  [SampleStatus.REJECTED]: "Rejeitado",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function GrupoSection({
  grupo,
  valores,
  onChangeParam,
}: {
  grupo: GrupoParametros;
  valores: GrupoForm;
  onChangeParam: (paramNome: string, value: string) => void;
}) {
  return (
    <div className="rounded-md border">
      <div className="border-b bg-muted/40 px-4 py-2.5">
        <p className="text-sm font-semibold">
          {grupo.nomeGrupo || "Parâmetros"}
        </p>
      </div>
      <div className="divide-y">
        {grupo.parametros.map((param) => (
          <div
            key={param.nome}
            className="grid grid-cols-1 items-start gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="text-sm font-medium">{param.nome}</p>
              {param.referencia && (
                <p className="text-xs text-muted-foreground">
                  Ref: {param.referencia}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="—"
                value={valores[param.nome] ?? ""}
                onChange={(e) => onChangeParam(param.nome, e.target.value)}
                className="w-36"
              />
              {param.unidade && param.unidade !== "—" && (
                <span className="shrink-0 text-sm text-muted-foreground">
                  {param.unidade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-72" />
      </header>
      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CadastroResultadoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [sample, setSample] = useState<Sample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const sampleId = Number(id);
    if (!sampleId || isNaN(sampleId)) {
      setLoadError("ID de amostra inválido.");
      setIsLoading(false);
      return;
    }

    findSampleById(sampleId)
      .then((data) => {
        setSample(data);
        setForm(buildInitialState(data.researchProject.examTypes));
      })
      .catch(() => setLoadError("Amostra não encontrada."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <PageSkeleton />;

  if (loadError || !sample) {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <ClipboardCheck className="size-6" />
            Cadastro de Resultados
          </h1>
        </header>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="size-10 text-destructive/50" aria-hidden />
            <p className="text-sm font-medium">
              {loadError ?? "Amostra não encontrada."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/amostras")}
            >
              Voltar para amostras
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sample.approvalStatus !== ApprovalStatus.APPROVED) {
    const msg =
      sample.approvalStatus === ApprovalStatus.REJECTED
        ? "Esta amostra foi rejeitada e não pode receber resultados."
        : "Esta amostra ainda não foi aprovada. Aguarde a aprovação para cadastrar resultados.";

    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <ClipboardCheck className="size-6" />
            Cadastro de Resultados
          </h1>
        </header>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FlaskConical
              className="size-10 text-muted-foreground/40"
              aria-hidden
            />
            <p className="text-sm font-medium">{msg}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {sample.protocol}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/amostras")}
            >
              Voltar para amostras
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sample.status === SampleStatus.DONE) {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Cadastro de Resultados</h1>
          <p className="text-sm text-muted-foreground">
            Todos os resultados desta amostra já foram cadastrados.
          </p>
        </header>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma alteração pode ser realizada. Protocolo:{" "}
              <span className="font-mono">{sample.protocol}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleParamChange(
    examTypeId: number,
    nomeGrupo: string,
    paramNome: string,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [examTypeId]: {
        ...prev[examTypeId],
        parametros: {
          ...prev[examTypeId].parametros,
          [nomeGrupo]: {
            ...prev[examTypeId].parametros[nomeGrupo],
            [paramNome]: value,
          },
        },
      },
    }));
  }

  function handleFieldChange(
    examTypeId: number,
    field: "valorGenerico" | "observacoes",
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [examTypeId]: { ...prev[examTypeId], [field]: value },
    }));
  }

  async function salvarResultados() {
    setIsSaving(true);
    try {
      const examTypes = sample.researchProject.examTypes;
      for (const et of examTypes) {
        const etForm = form[et.id];
        await createSampleResult({
          sampleId: sample.id,
          examTypeId: et.id,
          resultData: buildResultData(et, etForm),
        });
      }
      toast.success("Resultados cadastrados com sucesso.");
      router.push("/amostras");
    } catch {
      toast.error(
        "Erro ao salvar resultados. Verifique os dados e tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const examTypes = sample.researchProject.examTypes;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <ClipboardCheck className="size-6" />
          Cadastro de Resultados
        </h1>
        <p className="text-sm text-muted-foreground">
          Registre os resultados dos exames da amostra.
        </p>
      </header>

      {/* Informações da Amostra */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informações da Amostra</CardTitle>
          <CardDescription>Dados gerais da solicitação.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Protocolo</p>
            <p className="font-mono font-medium">{sample.protocol}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pesquisador</p>
            <p className="font-medium">
              {sample.researchProject.researcher.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projeto</p>
            <p className="font-medium">{sample.researchProject.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data do Agendamento</p>
            <p className="font-medium">
              {sample.scheduledAt
                ? new Date(sample.scheduledAt).toLocaleDateString("pt-BR")
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Animais nesta remessa
            </p>
            <p className="font-medium">{sample.animalsInThisShipment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant="outline"
              className={statusClass[sample.status] ?? ""}
            >
              {statusLabel[sample.status] ?? sample.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Formulário por tipo de exame */}
      {examTypes.map((et) => {
        const etForm = form[et.id];
        if (!etForm) return null;

        return (
          <Card key={et.id}>
            <CardHeader className="border-b">
              <CardTitle>{et.name}</CardTitle>
              <CardDescription>
                Preencha os resultados obtidos na análise.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {et.grupos && et.grupos.length > 0 ? (
                <>
                  {et.grupos.map((grupo) => (
                    <GrupoSection
                      key={grupo.nomeGrupo ?? "default"}
                      grupo={grupo}
                      valores={etForm.parametros[grupo.nomeGrupo ?? ""] ?? {}}
                      onChangeParam={(paramNome, value) =>
                        handleParamChange(
                          et.id,
                          grupo.nomeGrupo ?? "",
                          paramNome,
                          value,
                        )
                      }
                    />
                  ))}
                  <div className="space-y-1.5">
                    <Label htmlFor={`obs-${et.id}`}>
                      Observações{" "}
                      <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Textarea
                      id={`obs-${et.id}`}
                      placeholder="Ex: Série Vermelha — Normocitose e Normocromia"
                      value={etForm.observacoes}
                      onChange={(e) =>
                        handleFieldChange(et.id, "observacoes", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor={`val-${et.id}`}>Resultado</Label>
                    <Input
                      id={`val-${et.id}`}
                      placeholder="Digite o resultado"
                      value={etForm.valorGenerico}
                      onChange={(e) =>
                        handleFieldChange(
                          et.id,
                          "valorGenerico",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`obs-${et.id}`}>
                      Observações{" "}
                      <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Textarea
                      id={`obs-${et.id}`}
                      placeholder="Observações (opcional)"
                      value={etForm.observacoes}
                      onChange={(e) =>
                        handleFieldChange(et.id, "observacoes", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/amostras")}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button onClick={salvarResultados} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Salvando...
            </>
          ) : (
            "Salvar Resultados"
          )}
        </Button>
      </div>
    </div>
  );
}
