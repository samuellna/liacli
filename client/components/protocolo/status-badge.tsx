import {
  CheckCircle2,
  Clock,
  FlaskConical,
  Microscope,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApprovalStatus, SampleStatus } from "@/api/types";

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
  status: ApprovalStatus;
  size?: BadgeSize;
}) {
  const configs: Record<
    ApprovalStatus,
    { icon: React.ElementType; label: string; colorClass: string }
  > = {
    APPROVED: {
      icon: CheckCircle2,
      label: "Aprovado",
      colorClass: "bg-muted text-success",
    },
    PENDING: {
      icon: Clock,
      label: "Pendente",
      colorClass: "bg-muted text-warning-foreground",
    },
    REJECTED: {
      icon: XCircle,
      label: "Rejeitado",
      colorClass: "bg-muted text-destructive",
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
  status: SampleStatus;
  size?: BadgeSize;
}) {
  const configs: Record<
    SampleStatus,
    { icon: React.ElementType; label: string; colorClass: string }
  > = {
    PENDING: {
      icon: Clock,
      label: "Aguardando",
      colorClass: "bg-muted text-muted-foreground",
    },
    COLLECTED: {
      icon: Clock,
      label: "Coletado",
      colorClass: "bg-muted text-muted-foreground",
    },
    ANALYZING: {
      icon: Microscope,
      label: "Em análise",
      colorClass: "bg-muted text-info",
    },
    DONE: {
      icon: FlaskConical,
      label: "Concluído",
      colorClass: "bg-muted text-success",
    },
    REJECTED: {
      icon: XCircle,
      label: "Rejeitado",
      colorClass: "bg-muted text-destructive",
    },
  };

  const { icon, label, colorClass } = configs[status];
  return (
    <BaseBadge icon={icon} label={label} colorClass={colorClass} size={size} />
  );
}
