"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardCheck,
  FlaskConical,
  Loader2,
  Upload,
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
import type { ExamType, ParameterGroups, Sample } from "@/api/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type GroupForm = Record<string, string>;

type ExameFormState = {
  parameters: Record<string, GroupForm>;
  observations: string;
  genericValue: string;
};

type FormState = Record<number, ExameFormState>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialState(examTypes: ExamType[]): FormState {
  const state: FormState = {};
  for (const et of examTypes) {
    const parameters: Record<string, GroupForm> = {};
    if (et.groups) {
      for (const group of et.groups) {
        const key = group.groupName ?? "";
        parameters[key] = {};
        for (const param of group.parameters) {
          parameters[key][param.name] = "";
        }
      }
    }
    state[et.id] = { parameters, observations: "", genericValue: "" };
  }
  return state;
}

function buildResultData(
  et: ExamType,
  etForm: ExameFormState,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (et.groups && et.groups.length > 0) {
    for (const group of et.groups) {
      const key = group.groupName ?? "";
      data[key] = { ...etForm.parameters[key] };
    }
  } else {
    data.resultData = etForm.genericValue;
  }

  return data;
}

function parseAndValidateJson(
  raw: unknown,
  et: ExamType,
): { ok: true; state: ExameFormState } | { ok: false; errors: string[] } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      ok: false,
      errors: [
        "O JSON deve ser um objeto ({}), não um array ou valor primitivo.",
      ],
    };
  }

  const obj = raw as Record<string, unknown>;
  const errors: string[] = [];
  const parameters: Record<string, GroupForm> = {};
  let genericValue = "";

  if (et.groups && et.groups.length > 0) {
    for (const group of et.groups) {
      const key = group.groupName ?? "";

      if (!(key in obj)) {
        errors.push(`Grupo obrigatório ausente: "${key}"`);
        continue;
      }

      const groupData = obj[key];
      if (
        typeof groupData !== "object" ||
        groupData === null ||
        Array.isArray(groupData)
      ) {
        errors.push(`O valor do grupo "${key}" deve ser um objeto.`);
        continue;
      }

      const groupObj = groupData as Record<string, unknown>;
      parameters[key] = {};

      for (const param of group.parameters) {
        if (!(param.name in groupObj)) {
          errors.push(
            `Parâmetro obrigatório ausente no grupo "${key}": "${param.name}"`,
          );
          continue;
        }

        const val = groupObj[param.name];
        if (typeof val !== "string" && typeof val !== "number") {
          errors.push(
            `O parâmetro "${param.name}" no grupo "${key}" deve ser texto ou número (recebido: ${typeof val}).`,
          );
          continue;
        }

        parameters[key][param.name] = String(val);
      }
    }
  } else {
    if (!("resultData" in obj)) {
      errors.push('Campo obrigatório ausente: "resultData".');
    } else {
      const val = obj.resultData;
      if (typeof val !== "string" && typeof val !== "number") {
        errors.push(
          `"resultData" deve ser texto ou número (recebido: ${typeof val}).`,
        );
      } else {
        genericValue = String(val);
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  const rawObs = obj.observations;
  const observations =
    rawObs != null && (typeof rawObs === "string" || typeof rawObs === "number")
      ? String(rawObs)
      : "";

  return { ok: true, state: { parameters, observations, genericValue } };
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

function InfoItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
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

function GroupSection({
  group,
  values,
  onChangeParam,
}: {
  group: ParameterGroups;
  values: GroupForm;
  onChangeParam: (paramNome: string, value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <div className="border-b bg-primary/5 px-4 py-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
          {group.groupName || "Parâmetros"}
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {group.parameters.map((param) => (
          <div
            key={param.name}
            className="grid grid-cols-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/20 sm:grid-cols-[1fr_auto_auto]"
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
              <Input
                placeholder="—"
                value={values[param.name] ?? ""}
                onChange={(e) => onChangeParam(param.name, e.target.value)}
                className="w-36 border-border/60 bg-background/80 font-mono text-sm focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
              {param.unit && param.unit !== "—" && (
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
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

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3.5 w-72" />
          </div>
        </div>
      </header>
      <Card className="overflow-hidden border border-border/60 shadow-sm">
        <div className="border-b bg-primary/5 p-5">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <CardContent className="grid gap-5 pt-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="overflow-hidden border border-border/60 shadow-sm">
        <div className="border-b bg-primary/5 p-5">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
        <CardContent className="space-y-4 pt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
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
  const [importErrors, setImportErrors] = useState<Record<number, string[]>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importTargetIdRef = useRef<number | null>(null);

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
        <header>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/amostras")}
              aria-label="Voltar"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="size-4 text-primary" aria-hidden />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Cadastro de Resultados
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
                {loadError ?? "Amostra não encontrada."}
              </p>
              <p className="text-xs text-muted-foreground">
                Verifique o identificador e tente novamente.
              </p>
            </div>
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
        <header>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/amostras")}
              aria-label="Voltar"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="size-4 text-primary" aria-hidden />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Cadastro de Resultados
              </h1>
            </div>
          </div>
        </header>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
              <FlaskConical
                className="size-6 text-muted-foreground/50"
                aria-hidden
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{msg}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {sample.protocol}
              </p>
            </div>
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
        <header>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/amostras")}
              aria-label="Voltar"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Cadastro de Resultados
              </h1>
              <p className="text-sm text-muted-foreground">
                Todos os resultados desta amostra já foram cadastrados.
              </p>
            </div>
          </div>
        </header>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-success/10">
              <ClipboardCheck className="size-6 text-success" aria-hidden />
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhuma alteração pode ser realizada. Protocolo:{" "}
              <span className="font-mono font-semibold text-foreground">
                {sample.protocol}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleImportClick(examTypeId: number) {
    importTargetIdRef.current = examTypeId;
    setImportErrors((prev) => ({ ...prev, [examTypeId]: [] }));
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const targetId = importTargetIdRef.current;
    e.target.value = "";

    if (!file || targetId === null || !sample) return;

    if (!file.name.endsWith(".json")) {
      setImportErrors((prev) => ({
        ...prev,
        [targetId]: ["Apenas arquivos .json são aceitos."],
      }));
      return;
    }

    const examType = sample.researchProject.examTypes.find(
      (et) => et.id === targetId,
    );
    if (!examType) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text !== "string") {
        setImportErrors((prev) => ({
          ...prev,
          [targetId]: ["Não foi possível ler o arquivo."],
        }));
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        setImportErrors((prev) => ({
          ...prev,
          [targetId]: ["JSON mal formatado. Verifique a sintaxe do arquivo."],
        }));
        return;
      }

      const result = parseAndValidateJson(parsed, examType);
      if (!result.ok) {
        setImportErrors((prev) => ({ ...prev, [targetId]: result.errors }));
        return;
      }

      setForm((prev) => ({ ...prev, [targetId]: result.state }));
      setImportErrors((prev) => ({ ...prev, [targetId]: [] }));
      toast.success(
        "JSON importado com sucesso. Revise os dados antes de salvar.",
      );
    };
    reader.onerror = () => {
      setImportErrors((prev) => ({
        ...prev,
        [targetId]: ["Erro ao ler o arquivo."],
      }));
    };
    reader.readAsText(file);
  }

  function handleParamChange(
    examTypeId: number,
    groupName: string,
    paramNome: string,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [examTypeId]: {
        ...prev[examTypeId],
        parameters: {
          ...prev[examTypeId].parameters,
          [groupName]: {
            ...prev[examTypeId].parameters[groupName],
            [paramNome]: value,
          },
        },
      },
    }));
  }

  function handleFieldChange(
    examTypeId: number,
    field: "genericValue" | "observations",
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [examTypeId]: { ...prev[examTypeId], [field]: value },
    }));
  }

  async function salvarResultados() {
    setIsSaving(true);
    if (loadError || !sample) {
      toast.error("Amostra inválida. Impossível salvar resultados.");
      setIsSaving(false);
      return;
    }
    try {
      const examTypes = sample.researchProject.examTypes;
      for (const et of examTypes) {
        const etForm = form[et.id];
        await createSampleResult({
          sampleId: sample.id,
          examTypeId: et.id,
          resultData: buildResultData(et, etForm),
          observations: etForm.observations.trim() || undefined,
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
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/amostras")}
            aria-label="Voltar"
            className="shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
              <ClipboardCheck
                className="size-5 text-primary-foreground"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Cadastro de Resultados
              </h1>
              <p className="text-sm text-muted-foreground">
                Registre os resultados dos exames da amostra.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Informações da Amostra */}
      <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
        <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
          <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
            Informações da Amostra
          </CardTitle>
          <CardDescription className="text-xs">
            Dados gerais da solicitação.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 pt-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
          <InfoItem label="Protocolo" value={sample.protocol} mono />
          <InfoItem
            label="Pesquisador"
            value={sample.researchProject.researcher.name}
          />
          <InfoItem
            label="Data do Agendamento"
            value={
              sample.scheduledAt
                ? new Date(sample.scheduledAt).toLocaleDateString("pt-BR")
                : "—"
            }
          />
          <InfoItem label="Projeto" value={sample.researchProject.title} />
          <InfoItem
            label="Animais nesta remessa"
            value={sample.animalsInThisShipment}
          />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Status
            </p>
            <Badge
              variant="outline"
              className={statusClass[sample.status] ?? ""}
            >
              {statusLabel[sample.status] ?? sample.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Input oculto compartilhado para upload de JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Formulário por tipo de exame */}
      {examTypes.map((et) => {
        const etForm = form[et.id];
        if (!etForm) return null;
        const etErrors = importErrors[et.id] ?? [];

        return (
          <Card
            key={et.id}
            className="overflow-hidden border border-border/60 shadow-sm py-0"
          >
            <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {et.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Preencha os resultados obtidos na análise.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleImportClick(et.id)}
                  className="shrink-0 gap-1.5 border-primary/25 bg-primary/5 text-xs font-semibold text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Upload className="size-3.5" aria-hidden />
                  Importar JSON
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-5 pb-4">
              {etErrors.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-destructive/30 bg-destructive/5">
                  <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-2.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-destructive">
                      Erro na importação
                    </p>
                  </div>
                  <ul className="space-y-1 px-4 py-3 text-xs text-destructive">
                    {etErrors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {et.groups && et.groups.length > 0 ? (
                <>
                  {et.groups.map((group) => (
                    <GroupSection
                      key={group.groupName ?? "default"}
                      group={group}
                      values={etForm.parameters[group.groupName ?? ""] ?? {}}
                      onChangeParam={(paramNome, value) =>
                        handleParamChange(
                          et.id,
                          group.groupName ?? "",
                          paramNome,
                          value,
                        )
                      }
                    />
                  ))}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`obs-${et.id}`}
                      className="text-xs font-semibold text-foreground"
                    >
                      Observações{" "}
                      <span className="font-normal text-muted-foreground">
                        (opcional)
                      </span>
                    </Label>
                    <Textarea
                      id={`obs-${et.id}`}
                      placeholder="Ex: Série Vermelha — Normocitose e Normocromia"
                      value={etForm.observations}
                      onChange={(e) =>
                        handleFieldChange(et.id, "observations", e.target.value)
                      }
                      rows={3}
                      className="border-border/60 bg-background/80 text-sm focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`val-${et.id}`}
                      className="text-xs font-semibold text-foreground"
                    >
                      Resultado
                    </Label>
                    <Input
                      id={`val-${et.id}`}
                      placeholder="Digite o resultado"
                      value={etForm.genericValue}
                      onChange={(e) =>
                        handleFieldChange(et.id, "genericValue", e.target.value)
                      }
                      className="border-border/60 bg-background/80 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`obs-${et.id}`}
                      className="text-xs font-semibold text-foreground"
                    >
                      Observações{" "}
                      <span className="font-normal text-muted-foreground">
                        (opcional)
                      </span>
                    </Label>
                    <Textarea
                      id={`obs-${et.id}`}
                      placeholder="Observações (opcional)"
                      value={etForm.observations}
                      onChange={(e) =>
                        handleFieldChange(et.id, "observations", e.target.value)
                      }
                      rows={3}
                      className="border-border/60 bg-background/80 text-sm focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Ações */}
      <div className="flex justify-end gap-3 border-t border-border/50 pt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/amostras")}
          disabled={isSaving}
          className="gap-2"
        >
          Cancelar
        </Button>
        <Button
          onClick={salvarResultados}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Salvando...
            </>
          ) : (
            <>
              <ClipboardCheck className="size-4" aria-hidden />
              Salvar Resultados
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
