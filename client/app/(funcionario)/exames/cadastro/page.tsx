"use client";

import { useState } from "react";
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
  Beaker,
  StickyNote,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createExamType } from "@/api/exams";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ── Schemas ──────────────────────────────────────────────────────────────────

const parametroSchema = z.object({
  name: z.string().min(1, "Informe o nome do parâmetro."),
  unit: z.string().optional(),
  reference: z.string().optional(),
});

const grupoSchema = z.object({
  groupName: z.string().optional(),
  parameters: z
    .array(parametroSchema)
    .min(1, "Adicione pelo menos um parâmetro neste grupo."),
});

const formExameSchema = z.object({
  title: z.string().min(1, "O título do exame é obrigatório."),
  material: z.string().optional(),
  description: z.string().optional(),
  observations: z.string().optional(),
  groups: z.array(grupoSchema).min(1, "Adicione pelo menos um grupo."),
});

type FormExame = z.infer<typeof formExameSchema>;

// ── Field error ──────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

type SectionProps = {
  step: number;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
};

function Section({ step, icon: Icon, title, description, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25">
          {step}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        {children}
      </div>
    </section>
  );
}

// ── Seção 1: Informações gerais ───────────────────────────────────────────────

function InformacoesGeraisSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormExame>();

  return (
    <Section
      step={1}
      icon={ClipboardList}
      title="Informações gerais"
      description="Dados de identificação e orientações do exame"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-semibold">
            Título do exame{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id="title"
            placeholder="Ex.: Hemograma Completo"
            {...register("title")}
            aria-invalid={!!errors.title}
            className="border-border/60 focus-visible:border-primary/60"
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="material" className="text-sm font-semibold">
            Material / Método
          </Label>
          <div className="relative">
            <Beaker className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="material"
              placeholder="Ex.: Sangue total com EDTA"
              {...register("material")}
              className="border-border/60 pl-9 focus-visible:border-primary/60"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold">
            Descrição
          </Label>
          <Textarea
            id="description"
            placeholder="Análise completa das células sanguíneas..."
            rows={3}
            className="resize-none border-border/60 focus-visible:border-primary/60"
            {...register("description")}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="observations" className="text-sm font-semibold">
            Observações de preparo
          </Label>
          <div className="relative">
            <StickyNote className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Textarea
              id="observations"
              placeholder="Ex.: Jejum de 8 horas obrigatório."
              rows={2}
              className="resize-none border-border/60 pl-9 focus-visible:border-primary/60"
              {...register("observations")}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Grupo item ────────────────────────────────────────────────────────────────

function GrupoItem({
  groupIndex,
  onRemove,
  totalGroups,
}: {
  groupIndex: number;
  onRemove: () => void;
  totalGroups: number;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormExame>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.parameters`,
  });

  const grupoErrors = errors.groups?.[groupIndex];

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Grupo header */}
      <div className="flex items-center gap-3 border-b border-border/50 bg-muted/30 px-4 py-3">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-[11px] font-bold text-primary">
          {groupIndex + 1}
        </div>
        <Input
          placeholder="Nome do grupo (ex.: Eritrograma)"
          className="h-8 flex-1 border-border/50 bg-background/80 text-sm focus-visible:border-primary/60"
          {...register(`groups.${groupIndex}.groupName`)}
        />
        {totalGroups > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={onRemove}
            title="Remover grupo"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Parâmetros */}
      <div className="space-y-3 p-4">
        {/* Coluna headers */}
        {fields.length > 0 && (
          <div className="hidden grid-cols-[1fr_120px_160px_32px] gap-2 sm:grid">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">
              Parâmetro
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">
              Unidade
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">
              Referência
            </span>
          </div>
        )}

        {fields.map((field, paramIndex) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_120px_160px_32px] sm:items-start"
          >
            <div className="space-y-1">
              <Input
                placeholder="Nome do parâmetro (Ex.: Hemácias)"
                {...register(`groups.${groupIndex}.parameters.${paramIndex}.name`)}
                aria-invalid={!!grupoErrors?.parameters?.[paramIndex]?.name}
                className="border-border/50 focus-visible:border-primary/60"
              />
              <FieldError
                message={grupoErrors?.parameters?.[paramIndex]?.name?.message}
              />
            </div>
            <Input
              placeholder="g/dL"
              {...register(`groups.${groupIndex}.parameters.${paramIndex}.unit`)}
              className="border-border/50 focus-visible:border-primary/60"
            />
            <Input
              placeholder="4,50 a 6,10"
              {...register(`groups.${groupIndex}.parameters.${paramIndex}.reference`)}
              className="border-border/50 focus-visible:border-primary/60"
            />
            {fields.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:mt-0"
                onClick={() => remove(paramIndex)}
                title="Remover parâmetro"
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : (
              <div className="hidden size-9 sm:block" />
            )}
          </div>
        ))}

        {typeof grupoErrors?.parameters?.root?.message === "string" && (
          <FieldError message={grupoErrors.parameters.root.message} />
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 w-full border-dashed border-border/60 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
          onClick={() => append({ name: "", unit: "", reference: "" })}
        >
          <Hash className="size-3.5 mr-1.5" aria-hidden />
          Adicionar parâmetro
        </Button>
      </div>
    </div>
  );
}

// ── Seção 2: Grupos e parâmetros ──────────────────────────────────────────────

function GruposSection() {
  const { control } = useFormContext<FormExame>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
  });

  return (
    <Section
      step={2}
      icon={FlaskConical}
      title="Grupos de parâmetros"
      description="Configure as seções e os parâmetros que serão medidos"
    >
      <div className="space-y-3">
        {fields.map((field, index) => (
          <GrupoItem
            key={field.id}
            groupIndex={index}
            totalGroups={fields.length}
            onRemove={() => remove(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
          onClick={() =>
            append({
              groupName: "",
              parameters: [{ name: "", unit: "", reference: "" }],
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

// ── Página principal ──────────────────────────────────────────────────────────

export default function CadastroExamePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormExame>({
    resolver: zodResolver(formExameSchema),
    defaultValues: {
      title: "",
      material: "",
      description: "",
      observations: "",
      groups: [
        { groupName: "", parameters: [{ name: "", unit: "", reference: "" }] },
      ],
    },
  });

  async function onSubmit(data: FormExame) {
    setIsSubmitting(true);
    try {
      await createExamType({
        name: data.title,
        description: data.description ?? "",
        material: data.material || undefined,
        observations: data.observations || undefined,
        groups: data.groups,
      });
      router.push("/exames");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/8 via-background to-accent/5 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-1.5 mb-3 gap-1.5 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/exames">
              <ArrowLeft className="size-4" />
              Voltar para exames
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-md shadow-primary/25">
              <FlaskConical className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Novo exame
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Configure a estrutura de um novo exame do laboratório.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Formulário ──────────────────────────────────────────────────── */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <InformacoesGeraisSection />
          <GruposSection />

          {/* ── Ações ────────────────────────────────────────────────── */}
          <div className="flex flex-col-reverse gap-3 border-t border-border/50 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 px-7 text-sm font-semibold"
              asChild
            >
              <Link href="/exames">Cancelar</Link>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-11 gap-2 px-7 text-sm font-semibold shadow-sm"
            >
              <Save className="size-4" aria-hidden />
              {isSubmitting ? "Salvando..." : "Salvar exame"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
