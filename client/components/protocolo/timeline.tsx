import {
  CalendarCheck,
  CheckCircle2,
  FileCheck,
  Inbox,
  Microscope,
  Package,
  Send,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { TimelineEvent } from "../../app/(pesquisador)/protocolo/[codigo]/_lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  send: Send,
  inbox: Inbox,
  "calendar-check": CalendarCheck,
  package: Package,
  microscope: Microscope,
  "file-check": FileCheck,
  "x-circle": XCircle,
};

function TimelineNode({
  event,
  isLast,
}: {
  event: TimelineEvent;
  isLast: boolean;
}) {
  const Icon = ICON_MAP[event.icon] ?? Send;

  return (
    <li className="relative flex gap-4">
      {/* Vertical connector line */}
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute left-4.25 top-9 h-[calc(100%-8px)] w-px",
            event.completed
              ? "bg-success/30"
              : event.current
                ? "bg-accent/30"
                : "border-l-2 border-dashed border-border",
          )}
        />
      )}

      {/* Node circle */}
      <div className="relative shrink-0 pt-0.5">
        {event.current && !event.completed && (
          <span
            aria-hidden
            className="absolute inset-0 m-auto size-9 animate-ping rounded-full bg-accent/20"
          />
        )}
        <span
          className={cn(
            "relative flex size-9 items-center justify-center rounded-full border-2",
            event.completed
              ? "border-success bg-success/10 text-success"
              : event.current
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          {event.completed ? (
            <CheckCircle2 className="size-4" aria-hidden />
          ) : (
            <Icon className="size-4" aria-hidden />
          )}
        </span>
      </div>

      {/* Content */}
      <div className={cn("min-w-0 flex-1 pb-8", isLast && "pb-0")}>
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              event.completed
                ? "text-foreground"
                : event.current
                  ? "text-foreground"
                  : "text-muted-foreground",
            )}
          >
            {event.label}
          </p>
          {event.current && (
            <span className="inline-flex h-4 items-center rounded-full bg-accent/10 px-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
              Atual
            </span>
          )}
        </div>

        {event.description && (
          <p
            className={cn(
              "mt-0.5 text-xs leading-relaxed",
              event.completed || event.current
                ? "text-muted-foreground"
                : "text-muted-foreground/50",
            )}
          >
            {event.description}
          </p>
        )}

        <time
          className={cn(
            "mt-1 block text-xs",
            event.completed
              ? "text-muted-foreground/70"
              : event.current
                ? "text-accent/70 font-medium"
                : "text-muted-foreground/40",
          )}
        >
          {event.date}
        </time>
      </div>
    </li>
  );
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ul aria-label="Histórico de atualizações" className="space-y-0">
      {events.map((event, i) => (
        <TimelineNode
          key={event.id}
          event={event}
          isLast={i === events.length - 1}
        />
      ))}
    </ul>
  );
}
