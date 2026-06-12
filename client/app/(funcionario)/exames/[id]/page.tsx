"use client";

import { useEffect, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ClipboardList,
  FlaskConical,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { findExamTypeById, updateExamType } from "@/api/exams";
import type { ExamType } from "@/api/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const parametroSchema = z.object({
  nome: z.string().min(1, "Informe o nome do parâmetro."),
  unidade: z.string().optional(),
  referencia: z.string().optional(),
});

const grupoSchema = z.object({
  nomeGrupo: z.string().optional(),
  parametros: z
    .array(parametroSchema)
    .min(1, "Adicione pelo menos um parâmetro neste grupo."),
});

const formExameSchema = z.object({
  titulo: z.string().min(1, "O título do exame é obrigatório."),
  material: z.string().optional(),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  grupos: z.array(grupoSchema).min(1, "Adicione pelo menos um grupo."),
});

type FormExame = z.infer<typeof formExameSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  );
}

type SectionProps = {
  step: number;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
};

function Section({ step, icon: Icon, title, description, children }: SectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          {step}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-accent" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function InformacoesGeraisSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormExame>();

  return (
    <Section
      step={1}
      icon={ClipboardList}
      title="Informações gerais do exame"
      description="Dados de identificação e orientações gerais"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="titulo">
            Título do exame{" "}
            <span aria-hidden className="text-destructive">*</span>
          </Label>
          <Input
            id="titulo"
            placeholder="Ex.: Hemograma Completo"
            {...register("titulo")}
            aria-invalid={!!errors.titulo}
          />
          <FieldError message={errors.titulo?.message} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="material">Material / Método</Label>
          <Input
            id="material"
            placeholder="Ex.: Sangue total com EDTA"
            {...register("material")}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Análise completa das células sanguíneas."
            rows={3}
            className="resize-none"
            {...register("descricao")}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="observacoes">Observações (Preparo)</Label>
          <Textarea
            id="observacoes"
            placeholder="Ex.: Este exame exige jejum de 8 horas."
            rows={2}
            className="resize-none"
            {...register("observacoes")}
          />
        </div>
      </div>
    </Section>
  );
}

function GrupoItem({
  groupIndex,
  onRemove,
  totalGrupos,
}: {
  groupIndex: number;
  onRemove: () => void;
  totalGrupos: number;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormExame>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `grupos.${groupIndex}.parametros`,
  });

  const grupoErrors = errors.grupos?.[groupIndex];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-5 last:mb-0">
      <div className="flex items-center justify-between bg-muted/30 p-3 border-b border-border">
        <div className="flex-1 mr-4 max-w-sm">
          <Input
            placeholder="Nome do grupo (ex.: Eritrograma)"
            className="bg-background"
            {...register(`grupos.${groupIndex}.nomeGrupo`)}
          />
        </div>
        {totalGrupos > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive shrink-0"
            onClick={onRemove}
            title="Remover grupo"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {fields.map((field, paramIndex) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-3 items-start"
          >
            <div className="flex-[2] w-full space-y-1.5">
              <Input
                placeholder="Nome do parâmetro (Ex.: Hemácias)"
                {...register(`grupos.${groupIndex}.parametros.${paramIndex}.nome`)}
                aria-invalid={!!grupoErrors?.parametros?.[paramIndex]?.nome}
              />
              <FieldError
                message={grupoErrors?.parametros?.[paramIndex]?.nome?.message}
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <Input
                placeholder="Unidade (Ex.: g/dL)"
                {...register(`grupos.${groupIndex}.parametros.${paramIndex}.unidade`)}
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <Input
                placeholder="Referência (Ex.: 4,50 a 6,10)"
                {...register(`grupos.${groupIndex}.parametros.${paramIndex}.referencia`)}
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                onClick={() => remove(paramIndex)}
                title="Remover parâmetro"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}

        {typeof grupoErrors?.parametros?.root?.message === "string" && (
          <FieldError message={grupoErrors.parametros.root.message} />
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed mt-2"
          onClick={() => append({ nome: "", unidade: "", referencia: "" })}
        >
          <Plus className="size-4 mr-2" aria-hidden />
          Adicionar parâmetro
        </Button>
      </div>
    </div>
  );
}

function GruposSection() {
  const { control } = useFormContext<FormExame>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "grupos",
  });

  return (
    <Section
      step={2}
      icon={FlaskConical}
      title="Grupos de parâmetros"
      description="Configure as seções e os parâmetros que serão medidos neste exame"
    >
      <div className="space-y-4">
        <div className="space-y-0">
          {fields.map((field, index) => (
            <GrupoItem
              key={field.id}
              groupIndex={index}
              totalGrupos={fields.length}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() =>
            append({
              nomeGrupo: "",
              parametros: [{ nome: "", unidade: "", referencia: "" }],
            })
          }
        >
          <Plus className="size-4 mr-2" aria-hidden />
          Adicionar grupo de parâmetros
        </Button>
      </div>
    </Section>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-64 rounded" />
      <Skeleton className="h-4 w-48 rounded" />
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-20 w-full rounded" />
      </div>
    </div>
  );
}

function examToForm(exam: ExamType): FormExame {
  return {
    titulo: exam.name,
    material: exam.material ?? "",
    descricao: exam.description ?? "",
    observacoes: exam.observacoes ?? "",
    grupos:
      exam.grupos && exam.grupos.length > 0
        ? exam.grupos.map((g) => ({
            nomeGrupo: g.nomeGrupo ?? "",
            parametros:
              g.parametros.length > 0
                ? g.parametros.map((p) => ({
                    nome: p.nome,
                    unidade: p.unidade ?? "",
                    referencia: p.referencia ?? "",
                  }))
                : [{ nome: "", unidade: "", referencia: "" }],
          }))
        : [{ nomeGrupo: "", parametros: [{ nome: "", unidade: "", referencia: "" }] }],
  };
}

export default function ExameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [exam, setExam] = useState<ExamType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const methods = useForm<FormExame>({
    resolver: zodResolver(formExameSchema),
    defaultValues: {
      titulo: "",
      material: "",
      descricao: "",
      observacoes: "",
      grupos: [{ nomeGrupo: "", parametros: [{ nome: "", unidade: "", referencia: "" }] }],
    },
  });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await findExamTypeById(id);
        setExam(data);
        methods.reset(examToForm(data));
      } catch {
        setLoadError("Não foi possível carregar os dados do exame.");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) load();
  }, [id, methods]);

  async function onSubmit(data: FormExame) {
    setIsSubmitting(true);
    setSaveSuccess(false);
    try {
      const updated = await updateExamType(id, {
        name: data.titulo,
        description: data.descricao ?? "",
        material: data.material || undefined,
        observacoes: data.observacoes || undefined,
        grupos: data.grupos,
      });
      setExam(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // errors surfaced by react-hook-form or toast if needed
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-1.5 text-muted-foreground" asChild>
          <Link href="/exames">
            <ArrowLeft className="size-4" />
            Voltar para exames
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {isLoading ? <Skeleton className="h-7 w-64 rounded inline-block" /> : (exam?.name ?? "Exame")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Edite as informações, grupos e parâmetros do exame.
        </p>
      </div>

      {isLoading && <PageSkeleton />}

      {!isLoading && loadError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <AlertCircle className="size-10 text-destructive/50" />
          <p className="text-sm font-medium text-foreground">
            Não foi possível carregar o exame
          </p>
          <p className="text-xs text-muted-foreground">{loadError}</p>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !loadError && (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="space-y-8"
          >
            <InformacoesGeraisSection />
            <GruposSection />

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end border-t border-border mt-8">
              {saveSuccess && (
                <p className="text-sm text-green-600 font-medium sm:mr-auto">
                  Alterações salvas com sucesso.
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-semibold sm:w-auto"
                asChild
              >
                <Link href="/exames">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-12 px-8 text-sm font-semibold sm:w-auto"
              >
                <Save className="size-4 mr-2" aria-hidden />
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
