"use client";

import { useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Loader2,
  Plus,
  Send,
  User,
  BookOpen,
  CalendarDays,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  schedulingSchema,
  NIVEL_OPTIONS,
  type SchedulingFormData,
} from "../../app/(pesquisador)/agendamento/_lib/schema";
import { getWeekById } from "../../app/(pesquisador)/agendamento/_lib/weeks";
import { SampleItem } from "./sample-item";
import { WeekPicker } from "./week-picker";
import { randomBytes } from "crypto";

export function generateProtocol(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return Array.from(randomBytes(7))
    .map((byte) => chars[byte % chars.length])
    .join("");
}

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

function Section({
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

function ResearcherSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();

  return (
    <Section
      step={1}
      icon={User}
      title="Dados do pesquisador"
      description="Informações de contato e identificação"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">
            Nome completo{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id="nome"
            placeholder="Seu nome completo"
            {...register("nome")}
            aria-invalid={!!errors.nome}
          />
          <FieldError message={errors.nome?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            E-mail{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@instituicao.edu.br"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            type="tel"
            placeholder="(81) 9 9999-9999"
            {...register("telefone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="orientador">Nome do orientador</Label>
          <Input
            id="orientador"
            placeholder="Nome do orientador responsável"
            {...register("orientador")}
          />
        </div>
      </div>
    </Section>
  );
}

function StudySection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();

  return (
    <Section
      step={2}
      icon={BookOpen}
      title="Informações do estudo"
      description="Dados sobre o projeto de pesquisa e vinculação acadêmica"
    >
      <div className="space-y-5">
        <div className="space-y-2.5">
          <Label>
            Nível acadêmico{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Controller
            control={control}
            name="nivel"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
                aria-required="true"
              >
                {NIVEL_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={`nivel-${opt.value}`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm transition-colors hover:bg-muted/50 has-[button[data-state=checked]]:border-accent/50 has-[button[data-state=checked]]:bg-accent/5"
                  >
                    <RadioGroupItem
                      id={`nivel-${opt.value}`}
                      value={opt.value}
                    />
                    <span className="leading-snug">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          <FieldError message={errors.nivel?.message} />
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="titulo">
              Título da pesquisa / Projeto{" "}
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id="titulo"
              placeholder="Título completo da pesquisa ou projeto"
              {...register("tituloProjeto")}
              aria-invalid={!!errors.tituloProjeto}
            />
            <FieldError message={errors.tituloProjeto?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="curso">Curso / Programa de pós-graduação</Label>
            <Input
              id="curso"
              placeholder="Ex.: Mestrado em Ciências Biológicas"
              {...register("cursoPrograma")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="laboratorio">Laboratório de pesquisa</Label>
            <Input
              id="laboratorio"
              placeholder="Ex.: Laboratório de Fisiologia Animal — UFPE"
              {...register("laboratorio")}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function SamplesSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "amostras",
  });

  return (
    <Section
      step={3}
      icon={FlaskConical}
      title="Amostras"
      description="Adicione uma ou mais remessas de amostras ao agendamento"
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <SampleItem
            key={field.id}
            index={index}
            total={fields.length}
            onRemove={() => remove(index)}
          />
        ))}

        {typeof errors.amostras?.message === "string" && (
          <FieldError message={errors.amostras.message} />
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() =>
            append({
              especieAnimal: "",
              totalAnimais: 1,
              exames: [],
              outroExame: "",
              previsaoRemessas: "",
            })
          }
        >
          <Plus className="size-4" aria-hidden />
          Adicionar outra amostra
        </Button>
      </div>
    </Section>
  );
}

function WeekSection() {
  return (
    <Section
      step={4}
      icon={CalendarDays}
      title="Semana de envio"
      description="Selecione a semana em que deseja realizar o envio das amostras"
    >
      <WeekPicker />
    </Section>
  );
}

function ObservationsSection() {
  const { register } = useFormContext<SchedulingFormData>();

  return (
    <Section
      step={5}
      icon={StickyNote}
      title="Observações adicionais"
      description="Informações complementares relevantes para o laboratório (opcional)"
    >
      <Textarea
        id="observacoes"
        placeholder="Descreva aqui qualquer informação adicional sobre as amostras, cuidados especiais ou condições de armazenamento..."
        rows={4}
        {...register("observacoes")}
        className="resize-none"
      />
    </Section>
  );
}

function FormSummary({ data }: { data: SchedulingFormData }) {
  const week = getWeekById(data.semana);

  return (
    <aside
      aria-label="Resumo do agendamento"
      className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <ClipboardList className="size-4 text-accent" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">
          Resumo do agendamento
        </h2>
      </div>

      <Separator />

      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Pesquisador</dt>
          <dd className="font-medium text-right">{data.nome || "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Semana</dt>
          <dd className="font-medium text-right">
            {week ? week.shortLabel : "Não selecionada"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Amostras</dt>
          <dd className="font-medium">
            {data.amostras.length}{" "}
            {data.amostras.length === 1 ? "lote" : "lotes"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total de animais</dt>
          <dd className="font-medium">
            {data.amostras.reduce(
              (acc, s) => acc + (Number(s.totalAnimais) || 0),
              0,
            )}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

function SuccessCard({
  protocol,
  name,
  onNew,
}: {
  protocol: string;
  name: string;
  onNew: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-8" aria-hidden />
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Agendamento enviado!
          </h2>
          <p className="text-muted-foreground">
            {name ? `Obrigado, ${name.split(" ")[0]}. ` : ""}
            Sua solicitação foi registrada com sucesso. Guarde o protocolo
            abaixo para acompanhar o status do agendamento.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-6 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Protocolo
          </p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
            {protocol}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/protocolo/${protocol}`}>
              Acompanhar agendamento
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onNew}
          >
            Novo agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SchedulingForm() {
  const [protocol, setProtocol] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SchedulingFormData>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      email: "",
      nome: "",
      telefone: "",
      orientador: "",
      nivel: "",
      tituloProjeto: "",
      cursoPrograma: "",
      laboratorio: "",
      semana: "",
      amostras: [
        {
          especieAnimal: "",
          totalAnimais: 1,
          exames: [],
          outroExame: "",
          previsaoRemessas: "",
        },
      ],
      observacoes: "",
    },
  });

  const watchedData = methods.watch();

  async function onSubmit(data: SchedulingFormData) {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setProtocol(generateProtocol());
    setIsSubmitting(false);
    void data;
  }

  if (protocol) {
    return (
      <SuccessCard
        protocol={protocol}
        name={watchedData.nome}
        onNew={() => {
          setProtocol(null);
          methods.reset();
        }}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6"
      >
        <ResearcherSection />
        <StudySection />
        <SamplesSection />
        <WeekSection />
        <ObservationsSection />

        <FormSummary data={watchedData} />

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 px-8 text-sm font-semibold sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Enviando…
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden />
                Confirmar agendamento
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
