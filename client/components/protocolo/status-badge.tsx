import {
  CheckCircle2,
  Clock,
  FlaskConical,
  Microscope,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  AgendamentoStatus,
  AnaliseStatus,
} from "../../app/(pesquisador)/protocolo/[codigo]/_lib/types";

type BadgeSize = "sm" | "md" | "lg";

const SIZE: Record<BadgeSize, string> = {
  sm: "h-5 gap-1 px-2 text-xs",
  md: "h-6 gap-1.5 px-2.5 text-xs",
  lg: "h-8 gap-2 px-3 text-sm font-semibold",
};

const ICON_SIZE: Record<BadgeSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

function BaseBadge({
  icon: Icon,
  label,
  colorClass,
  size = "md",
}: {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  size?: BadgeSize;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-medium",
        SIZE[size],
        colorClass,
      )}
    >
      <Icon className={ICON_SIZE[size]} aria-hidden />
      {label}
    </span>
  );
}

export function AgendamentoBadge({
  status,
  size = "md",
}: {
  status: AgendamentoStatus;
  size?: BadgeSize;
}) {
  const configs: Record<
    AgendamentoStatus,
    { icon: React.ElementType; label: string; colorClass: string }
  > = {
    aprovado: {
      icon: CheckCircle2,
      label: "Aprovado",
      colorClass: "bg-success/10 text-success",
    },
    pendente: {
      icon: Clock,
      label: "Pendente",
      colorClass: "bg-warning/10 text-warning-foreground",
    },
    rejeitado: {
      icon: XCircle,
      label: "Rejeitado",
      colorClass: "bg-destructive/10 text-destructive",
    },
  };

  const { icon, label, colorClass } = configs[status];
  return (
    <BaseBadge icon={icon} label={label} colorClass={colorClass} size={size} />
  );
}

export function AnaliseBadge({
  status,
  size = "md",
}: {
  status: AnaliseStatus;
  size?: BadgeSize;
}) {
  const configs: Record<
    AnaliseStatus,
    { icon: React.ElementType; label: string; colorClass: string }
  > = {
    aguardando: {
      icon: Clock,
      label: "Aguardando",
      colorClass: "bg-muted text-muted-foreground",
    },
    em_analise: {
      icon: Microscope,
      label: "Em análise",
      colorClass: "bg-info/10 text-info",
    },
    concluido: {
      icon: FlaskConical,
      label: "Concluído",
      colorClass: "bg-success/10 text-success",
    },
  };

  const { icon, label, colorClass } = configs[status];
  return (
    <BaseBadge icon={icon} label={label} colorClass={colorClass} size={size} />
  );
}
