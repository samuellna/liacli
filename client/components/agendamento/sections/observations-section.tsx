"use client";

import { useFormContext } from "react-hook-form";
import { StickyNote } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import type { SchedulingFormData } from "@/app/(pesquisador)/agendamento/_lib/schema";

import { Section } from "./section";

export function ObservationsSection() {
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
