export type WeekStatus = "available" | "busy" | "expired";

export interface SchedulingWeek {
  id: string;
  monday: Date;
  wednesday: Date;
  status: WeekStatus;
  shortLabel: string;
  rangeLabel: string;
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addWeeks(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function ptBrShort(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function ptBrMedium(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildBusySet(): Set<string> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = getMondayOfWeek(today);
  const busy = new Set<string>();
  for (const offset of [2, 5]) {
    const m = addWeeks(monday, offset);
    busy.add(toIsoDate(m));
  }
  return busy;
}

const BUSY_WEEKS = buildBusySet();

export function getUpcomingWeeks(count = 10): SchedulingWeek[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = getMondayOfWeek(today);

  return Array.from({ length: count }, (_, i) => {
    const monday = addWeeks(currentMonday, i);
    const wednesday = new Date(monday);
    wednesday.setDate(wednesday.getDate() + 2);
    wednesday.setHours(23, 59, 59, 999);

    const id = toIsoDate(monday);
    const isExpired = today > wednesday;
    const isBusy = BUSY_WEEKS.has(id);

    const status: WeekStatus = isExpired
      ? "expired"
      : isBusy
        ? "busy"
        : "available";

    return {
      id,
      monday,
      wednesday,
      status,
      shortLabel: `${ptBrShort(monday)} – ${ptBrShort(wednesday)}`,
      rangeLabel: `${ptBrMedium(monday)} até ${ptBrMedium(wednesday)}`,
    };
  });
}

export function getWeekById(id: string): SchedulingWeek | undefined {
  return getUpcomingWeeks(12).find((w) => w.id === id);
}
