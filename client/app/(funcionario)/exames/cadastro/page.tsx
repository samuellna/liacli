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
import { ClipboardList, FlaskConical, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createExamType } from "@/api/exams";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ESQUEMAS DE VALIDAÇÃO
const parametroSchema = z.object({
  // Validação de cada parâmetro
  name: z.string().min(1, "Informe o name do parâmetro."),
  unit: z.string().optional(),
  reference: z.string().optional(),
});

const grupoSchema = z.object({
  // Validação de cada grupo de parâmetros
  groupName: z.string().optional(),
  parameters: z
    .array(parametroSchema)
    .min(1, "Adicione pelo menos um parâmetro neste grupo."),
});

const formExameSchema = z.object({
  // Validação geral do formulário de exame
  title: z.string().min(1, "O título do exame é obrigatório."),
  material: z.string().optional(),
  description: z.string().optional(),
  observations: z.string().optional(),
  groups: z.array(grupoSchema).min(1, "Adicione pelo menos um grupo."),
});

type FormExame = z.infer<typeof formExameSchema>;

function FieldError({ message }: { message?: string }) {
  // Componente simples para exibir mensagens de erro de validação
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  );
}

type SectionProps = {
  // Propriedades para cada seção do formulário
  step: number;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
};

function Section({
  // Componente para estruturar cada seção do formulário com título, ícone e descrição
  step,
  icon: Icon,
  title,
  description,
  children,
}: SectionProps) {
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
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        {children}
      </div>
    </section>
  );
}

// BLOCO 1: INFORMAÇÕES GERAIS

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
          <Label htmlFor="title">
            Título do exame{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id="titulo"
            placeholder="Ex.: Hemograma Completo"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          <FieldError message={errors.title?.message} />
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
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Análise completa das células sanguíneas."
            rows={3}
            className="resize-none"
            {...register("description")}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="observations">Observações (Preparo)</Label>
          <Textarea
            id="observations"
            placeholder="Ex.: Este exame exige jejum de 8 horas."
            rows={2}
            className="resize-none"
            {...register("observations")}
          />
        </div>
      </div>
    </Section>
  );
}

// BLOCO 2: GRUPOS E PARÂMETROS

function GrupoItem({
  // Componente para cada grupo de parâmetros, permitindo adicionar/remover parâmetros e o próprio grupo
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
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-5 last:mb-0">
      {/* Cabeçalho do Grupo */}
      <div className="flex items-center justify-between bg-muted/30 p-3 border-b border-border">
        <div className="flex-1 mr-4 max-w-sm">
          <Input
            placeholder="Nome do grupo (ex.: Eritrograma)"
            className="bg-background"
            {...register(`groups.${groupIndex}.groupName`)}
          />
        </div>
        {totalGroups > 1 && (
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

      {/* Lista de Parâmetros */}
      <div className="p-4 space-y-4">
        {fields.map((field, paramIndex) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-3 items-start sm:items-start"
          >
            <div className="flex-2 w-full space-y-1.5">
              <Input
                placeholder="Nome do parâmetro (Ex.: Hemácias)"
                {...register(
                  `groups.${groupIndex}.parameters.${paramIndex}.name`,
                )}
                aria-invalid={!!grupoErrors?.parameters?.[paramIndex]?.name}
              />
              <FieldError
                message={grupoErrors?.parameters?.[paramIndex]?.name?.message}
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <Input
                placeholder="Unidade (Ex.: g/dL)"
                {...register(
                  `groups.${groupIndex}.parameters.${paramIndex}.unit`,
                )}
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <Input
                placeholder="Referência (Ex.: 4,50 a 6,10)"
                {...register(
                  `groups.${groupIndex}.parameters.${paramIndex}.reference`,
                )}
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

        {typeof grupoErrors?.parameters?.root?.message === "string" && ( // Erro geral do array de parâmetros (ex.: nenhum parâmetro adicionado)
          <FieldError message={grupoErrors.parameters.root.message} />
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed mt-2"
          onClick={() =>
            append({
              name: "",
              unit: "",
              reference: "",
            })
          }
        >
          <Plus className="size-4 mr-2" aria-hidden />
          Adicionar parâmetro
        </Button>
      </div>
    </div>
  );
}

function GruposSection() {
  // Componente para a seção de grupos de parâmetros, permitindo adicionar múltiplos grupos
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
      description="Configure as seções e os parâmetros que serão medidos neste exame"
    >
      <div className="space-y-4">
        <div className="space-y-0">
          {fields.map((field, index) => (
            <GrupoItem
              key={field.id}
              groupIndex={index}
              totalGroups={fields.length}
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
              groupName: "",
              parameters: [
                {
                  name: "",
                  unit: "",
                  reference: "",
                },
              ],
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

// PÁGINA PRINCIPAL

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
        {
          groupName: "",
          parameters: [
            {
              name: "",
              unit: "",
              reference: "",
            },
          ],
        },
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
    <div className="min-h-screen ">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cadastro de Exame
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure a estrutura de um novo exame oferecido pelo laboratório.
          </p>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="space-y-8"
          >
            <InformacoesGeraisSection />
            <GruposSection />

            {/* BLOCO 3: AÇÕES */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end border-t border-border mt-8">
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
                {isSubmitting ? "Salvando..." : "Salvar exame"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
