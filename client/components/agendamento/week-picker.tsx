"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { findActiveScheduledDates } from "@/api/samples";
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

  const [busyDates, setBusyDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadAvailability() {
    setLoadError(null);
    setIsLoading(true);
    try {
      const dates = await findActiveScheduledDates();
      setBusyDates(dates);
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar disponibilidade de semanas.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const weeks = getUpcomingWeeks(10, busyDates);

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

      {isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Carregando disponibilidade…
        </div>
      )}

      {!isLoading && loadError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <span className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {loadError}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadAvailability}
            className="gap-1.5"
          >
            <RefreshCw className="size-3.5" aria-hidden />
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !loadError && (
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
      )}

      {errors.preferredDate && (
        <p role="alert" className="text-xs text-destructive">
          {errors.preferredDate.message}
        </p>
      )}
    </div>
  );
}
