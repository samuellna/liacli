"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  schedulingSchema,
  type SchedulingFormData,
} from "@/app/(pesquisador)/agendamento/_lib/schema";

import { ResearcherSection } from "./sections/researcher-section";
import { StudySection } from "./sections/study-section";
import { SamplesSection } from "./sections/samples-section";
import { WeekSection } from "./sections/week-section";
import { ObservationsSection } from "./sections/observations-section";
import { FormSummary } from "./form-summary";
import { SuccessCard } from "./success-card";
import { useSchedulingSubmit } from "./_hooks/use-scheduling-submit";

const DEFAULT_VALUES: SchedulingFormData = {
  email: "",
  name: "",
  phone: "",
  advisorName: "",
  level: "",
  title: "",
  course: "",
  researchLab: "",
  preferredDate: "",
  sample: [
    {
      animalSpecies: "",
      totalAnimals: 1,
      samples: [],
      expectedShipments: 1,
    },
  ],
  observations: "",
};

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
