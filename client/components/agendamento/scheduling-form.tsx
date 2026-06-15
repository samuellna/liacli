"use client";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Link,
  Loader2,
  Send,
  StickyNote,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_VALUES,
  LEVEL_OPTIONS,
  schedulingSchema,
  type SchedulingFormData,
} from "../../app/(pesquisador)/agendamento/_lib/schema";
import { getWeekById } from "../../app/(pesquisador)/agendamento/_lib/weeks";
import { SampleItem } from "./sample-item";
import { WeekPicker } from "./week-picker";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { useSchedulingSubmit } from "./_hooks/use-scheduling-submit";

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
            Nome completo
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id="nome"
            placeholder="Seu nome completo"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            E-mail
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
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(81) 9 9999-9999"
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="advisorName">Nome do orientador</Label>
          <Input
            id="advisorName"
            placeholder="Nome do orientador responsável"
            {...register("advisorName")}
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
            Nível acadêmico
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
                aria-required="true"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={`level-${opt.value}`}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm transition-colors hover:bg-muted/50 has-[button[data-state=checked]]:border-accent/50 has-[button[data-state=checked]]:bg-accent/5"
                  >
                    <RadioGroupItem
                      id={`level-${opt.value}`}
                      value={opt.value}
                    />
                    <span className="leading-snug">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          <FieldError message={errors.level?.message} />
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">
              Título da pesquisa / Projeto
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id="titulo"
              placeholder="Título completo da pesquisa ou projeto"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course">Curso / Programa de pós-graduação</Label>
            <Input
              id="course"
              placeholder="Ex.: Mestrado em Ciências Biológicas"
              {...register("course")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="researchLab">Laboratório de pesquisa</Label>
            <Input
              id="researchLab"
              placeholder="Ex.: Laboratório de Fisiologia Animal — UFPE"
              {...register("researchLab")}
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
  const { fields } = useFieldArray({
    control,
    name: "sample",
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
          <SampleItem key={field.id} index={index} />
        ))}

        {typeof errors.sample?.message === "string" && (
          <FieldError message={errors.sample.message} />
        )}
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
        id="observations"
        placeholder="Descreva aqui qualquer informação adicional sobre as amostras, cuidados especiais ou condições de armazenamento..."
        rows={4}
        {...register("observations")}
        className="resize-none"
      />
    </Section>
  );
}

function FormSummary({ data }: { data: SchedulingFormData }) {
  const week = getWeekById(data.preferredDate);

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
          <dd className="font-medium text-right">{data.name || "—"}</dd>
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
            {data.sample.length} {data.sample.length === 1 ? "lote" : "lotes"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Total de animais</dt>
          <dd className="font-medium">
            {data.sample.reduce(
              (acc, s) => acc + (Number(s.totalAnimals) || 0),
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
  const { state, submit, reset } = useSchedulingSubmit();

  const methods = useForm<SchedulingFormData>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedData = useWatch({
    control: methods.control,
  }) as SchedulingFormData;

  async function onSubmit(data: SchedulingFormData) {
    console.log("Submitting data:", data);
    await submit(data);
  }

  if (state.status === "success") {
    return (
      <SuccessCard
        protocol={state.protocol}
        name={watchedData.name}
        onNew={() => {
          reset();
          methods.reset();
        }}
      />
    );
  }

  const isSubmitting = state.status === "submitting";

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

        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive text-center">
            {state.message}
          </p>
        )}

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
