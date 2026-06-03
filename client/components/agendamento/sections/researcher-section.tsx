"use client";

import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SchedulingFormData } from "@/app/(pesquisador)/agendamento/_lib/schema";

import { Section, FieldError } from "./section";

export function ResearcherSection() {
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
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            type="tel"
            placeholder="(81) 9 9999-9999"
            {...register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="orientador">Nome do orientador</Label>
          <Input
            id="orientador"
            placeholder="Nome do orientador responsável"
            {...register("advisorName")}
          />
        </div>
      </div>
    </Section>
  );
}
