import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  FlaskConical,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { SchedulingForm } from "../../../components/agendamento/scheduling-form";

export const metadata = {
  title: "Agendamento de amostras — LIACLI",
  description:
    "Solicite o agendamento semanal de remessa de amostras para análise no laboratório LIACLI.",
};

export default function SchedulingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />

        <section aria-label="Formulário de agendamento">
          <SchedulingForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="LIACLI — página inicial"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FlaskConical className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-wide">LIACLI</span>
        </Link>

        <Button asChild variant="ghost" size="sm">
          <Link href="/pesquisador">
            <ArrowLeft className="size-4" aria-hidden />
            Portal do pesquisador
          </Link>
        </Button>
      </div>
    </header>
  );
}

const RULES = [
  {
    icon: Users,
    title: "Um pesquisador por semana",
    body: "Cada semana operacional é destinada a apenas um pesquisador. A reserva é confirmada na ordem de solicitação.",
  },
  {
    icon: CalendarClock,
    title: "Envio até quarta-feira",
    body: "As amostras devem chegar ao laboratório até a quarta-feira da semana selecionada. Envios fora do prazo não serão processados na mesma semana.",
  },
  {
    icon: AlertTriangle,
    title: "Agendamento com antecedência",
    body: "Recomendamos solicitar o agendamento com pelo menos 20 dias de antecedência para garantir a disponibilidade.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-sidebar text-sidebar-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
            <FlaskConical className="size-3.5" aria-hidden />
            Portal do pesquisador
          </span>

          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Agendamento de amostras
          </h1>

          <p className="mx-auto max-w-xl text-pretty text-base text-sidebar-foreground/80">
            Preencha o formulário abaixo para solicitar o envio de amostras ao
            laboratório LIACLI. Os agendamentos são realizados{" "}
            <strong className="text-sidebar-foreground">semanalmente</strong> e
            limitados a{" "}
            <strong className="text-sidebar-foreground">
              um pesquisador por semana operacional
            </strong>
            .
          </p>
        </div>

        <ul
          aria-label="Regras do agendamento"
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          {RULES.map((rule) => {
            const RuleIcon = rule.icon;
            return (
              <li
                key={rule.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <RuleIcon className="size-4" aria-hidden />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-sidebar-foreground">
                    {rule.title}
                  </p>
                  <p className="text-xs leading-relaxed text-sidebar-foreground/70">
                    {rule.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar text-sidebar-foreground/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} LIACLI — Gestão laboratorial</p>
        <p className="text-sidebar-foreground/50">
          Sistema homologado para laboratórios clínicos
        </p>
      </div>
    </footer>
  );
}
