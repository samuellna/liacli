"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { FlaskConical } from "lucide-react";

import type { SchedulingFormData } from "@/app/(pesquisador)/agendamento/_lib/schema";
import { SampleItem } from "@/components/agendamento/sample-item";

import { Section, FieldError } from "./section";

export function SamplesSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();

  const { fields } = useFieldArray({ control, name: "sample" });

  return (
    <Section
      step={3}
      icon={FlaskConical}
      title="Amostra"
      description="Adicione as informações da amostra"
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
