"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { SchedulingFormData } from "../../app/(pesquisador)/agendamento/_lib/schema";
import {
  getUpcomingWeeks,
  type SchedulingWeek,
  type WeekStatus,
} from "../../app/(pesquisador)/agendamento/_lib/weeks";

const STATUS_CONFIG: Record<
  WeekStatus,
  {
    label: string;
    icon: React.ElementType;
    cardClass: string;
    badgeClass: string;
  }
> = {
  available: {
    label: "Disponível",
    icon: CheckCircle2,
    cardClass:
      "border-border bg-card hover:border-accent/60 hover:shadow-md cursor-pointer",
    badgeClass: "bg-success/10 text-success",
  },
  busy: {
    label: "Ocupada",
    icon: XCircle,
    cardClass: "border-border bg-muted/40 opacity-60 cursor-not-allowed",
    badgeClass: "bg-destructive/10 text-destructive",
  },
  expired: {
    label: "Encerrada",
    icon: XCircle,
    cardClass: "border-border bg-muted/30 opacity-50 cursor-not-allowed",
    badgeClass: "bg-muted text-muted-foreground",
  },
};

function WeekCard({
  week,
  selected,
  onClick,
}: {
  week: SchedulingWeek;
  selected: boolean;
  onClick: () => void;
}) {
  const config = STATUS_CONFIG[week.status];
  const StatusIcon = config.icon;
  const isSelectable = week.status === "available";

  return (
    <button
      type="button"
      disabled={!isSelectable}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Semana ${week.shortLabel} — ${config.label}`}
      className={[
        "group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200",
        config.cardClass,
        selected
          ? "border-accent ring-2 ring-accent/30 shadow-md bg-accent/5"
          : "",
      ].join(" ")}
    >
      {selected && (
        <span
          aria-hidden
          className="absolute top-2.5 right-2.5 size-2 rounded-full bg-accent"
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
        <span
          className={[
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            config.badgeClass,
          ].join(" ")}
        >
          <StatusIcon className="size-3" aria-hidden />
          {config.label}
        </span>
      </div>

      <p className="text-sm font-semibold text-foreground leading-snug">
        {week.shortLabel}
      </p>
      <p className="text-xs text-muted-foreground">{week.rangeLabel}</p>
    </button>
  );
}

export function WeekPicker() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();

  const weeks = getUpcomingWeeks(10);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-warning-foreground"
          aria-hidden
        />
        <p className="text-sm text-foreground/80">
          <span className="font-semibold">Prazo de envio:</span> as amostras
          devem chegar ao laboratório até <strong>quarta-feira</strong> da
          semana selecionada. Semanas com o prazo encerrado ou ocupadas por
          outro pesquisador não estão disponíveis para seleção.
        </p>
      </div>

      <Controller
        control={control}
        name="preferredDate"
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-label="Selecione uma semana disponível"
            aria-required="true"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {weeks.map((week) => (
              <WeekCard
                key={week.id}
                week={week}
                selected={field.value === week.id}
                onClick={() =>
                  week.status === "available" && field.onChange(week.id)
                }
              />
            ))}
          </div>
        )}
      />

      {errors.preferredDate && (
        <p role="alert" className="text-xs text-destructive">
          {errors.preferredDate.message}
        </p>
      )}
    </div>
  );
}
