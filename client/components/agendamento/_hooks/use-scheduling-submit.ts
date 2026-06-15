"use client";

import { useState } from "react";
import { createResearcher, type CreateResearcherData } from "@/api/researchers";
import { createProject } from "@/api/projects";
import {
  EXAM_OPTIONS,
  type SchedulingFormData,
} from "@/app/(pesquisador)/agendamento/_lib/schema";
import { findExamTypeByName } from "@/api/exams";
import { createSample } from "@/api/samples";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; protocol: string }
  | { status: "error"; message: string };

export function useSchedulingSubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(data: SchedulingFormData) {
    setState({ status: "submitting" });
    try {
      // Step 1 — create researcher
      const researcherPayload: CreateResearcherData = {
        name: data.name,
        email: data.email,
        institution: data.researchLab || data.course || "Não informado",
        phone: data.phone,
        advisorName: data.advisorName,
        level: data.level as CreateResearcherData["level"],
      };
      const researcher = await createResearcher(researcherPayload);

      const examTypeIds = await Promise.all(
        data.sample
          .flatMap((s) => s.samples)
          .map((examId) => {
            const label =
              EXAM_OPTIONS.find((o) => o.id === examId)?.label ?? examId;
            return findExamTypeByName(label).then((exam) => {
              if (!exam)
                throw new Error(`Tipo de exame não encontrado: ${label}`);
              return exam.id;
            });
          }),
      );

      console.log(examTypeIds);
      const project = await createProject({
        researcherId: researcher.id,
        title: data.title,
        course: data.course ?? "",
        researchLab: data.researchLab ?? "",
        animalSpecies: data.sample[0].animalSpecies,
        totalAnimals: data.sample[0].totalAnimals,
        expectedShipments: data.sample[0].expectedShipments,
        preferredDate: data.preferredDate,
        examTypeIds: examTypeIds,
      });

      const sample = await createSample({
        researchProjectId: project.id,
        animalsInThisShipment: data.sample[0].totalAnimals,
        scheduledAt: data.preferredDate,
      });

      setState({ status: "success", protocol: sample.protocol });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar agendamento.";
      setState({ status: "error", message });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, submit, reset };
}
