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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-center gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-accent/10 group-hover:text-accent group-hover:ring-accent/20">
          <Icon className="size-6" aria-hidden />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="relative mt-5 space-y-2">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-sm text-foreground/80"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-7 flex flex-1 items-end">
        <Button asChild size="lg" className="h-11 w-full sm:w-auto">
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
