import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  ctaHref: string;
  ctaLabel: string;
};

export function ServiceCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
  ctaHref,
  ctaLabel,
}: ServiceCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-100/60">
      {/* Soft corner glow revealed on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Icon + eyebrow */}
      <div className="relative flex items-center gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-sm shadow-blue-200/60">
          <Icon className="size-6" aria-hidden />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-500/70">
          {eyebrow}
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="relative mt-5 space-y-2.5">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2.5 text-sm text-foreground/80"
          >
            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Check className="size-2.5 text-blue-500" aria-hidden />
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-7 flex flex-1 items-end">
        <Button
          asChild
          size="lg"
          className="h-11 w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-500"
        >
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}
