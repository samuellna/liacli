"use client";

import { ClipboardList } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { SchedulingFormData } from "@/app/(pesquisador)/agendamento/_lib/schema";
import { getWeekById } from "@/app/(pesquisador)/agendamento/_lib/weeks";

export function FormSummary({ data }: { data: SchedulingFormData }) {
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
