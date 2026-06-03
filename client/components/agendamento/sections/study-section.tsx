"use client";

import { useFormContext, Controller } from "react-hook-form";
import { BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  NIVEL_OPTIONS,
  type SchedulingFormData,
} from "@/app/(pesquisador)/agendamento/_lib/schema";

import { Section, FieldError } from "./section";

export function StudySection() {
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
          <FieldError message={errors.level?.message} />
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="titulo">
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
            <Label htmlFor="curso">Curso / Programa de pós-graduação</Label>
            <Input
              id="curso"
              placeholder="Ex.: Mestrado em Ciências Biológicas"
              {...register("course")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="laboratorio">Laboratório de pesquisa</Label>
            <Input
              id="laboratorio"
              placeholder="Ex.: Laboratório de Fisiologia Animal — UFPE"
              {...register("researchLab")}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
