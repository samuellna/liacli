import { ArrowRight, CalendarClock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BackLink } from "@/components/back-link";
import { ProtocolLookupCard } from "@/components/protocol-lookup-card";
import { ServiceCard } from "@/components/service-card";

export const metadata = {
  title: "Portal do pesquisador — LIACLI",
  description:
    "Agende amostras e consulte protocolos com segurança e rastreabilidade.",
};

export default function ResearcherHome() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main id="conteudo" className="flex-1">
        <HeroSection />
        <ServicesSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sidebar min-h-screen text-sidebar-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-112 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 size-112 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[24px_24px] opacity-50"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <BackLink
          href="/"
          className="mb-6 text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          Voltar para o início
        </BackLink>

        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
            <ShieldCheck className="size-3.5" aria-hidden />
            Portal seguro para pesquisadores
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Gerencie amostras e acompanhe exames com{" "}
            <span className="bg-linear-to-r from-accent to-info bg-clip-text text-transparent">
              clareza e segurança
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-pretty text-base text-sidebar-foreground/80 sm:text-lg">
            Agende novas coletas, acompanhe protocolos em andamento e tenha
            rastreabilidade total dos seus exames — tudo em um único portal.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="h-11 px-5 text-sm font-semibold"
            >
              <a href="#servicos">
                Explorar serviços
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 border-white/20 bg-white/5 px-5 text-sm font-semibold text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <a href="#consulta">Consultar protocolo</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section
      id="servicos"
      aria-labelledby="servicos-title"
      className="relative overflow-hidden min-h-screen bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-152 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-400/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.04)_1px,transparent_0)] bg-size-[32px_32px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-4 sm:py-12">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-blue-500"
            />
            Serviços disponíveis
          </span>

          <h2
            id="servicos-title"
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            O que você pode{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              fazer agora
            </span>
          </h2>

          <p className="mx-auto max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Escolha um dos serviços abaixo para iniciar uma nova solicitação ou
            acompanhar uma já em andamento.
          </p>
        </div>

        {/* Decorative divider */}
        <div
          aria-hidden
          className="mx-auto mt-10 flex items-center justify-center gap-2"
        >
          <div className="h-px w-20 bg-linear-to-r from-transparent to-blue-300" />
          <div className="size-1.5 rounded-full bg-blue-400" />
          <div className="size-1 rounded-full bg-blue-200" />
          <div className="size-1.5 rounded-full bg-blue-400" />
          <div className="h-px w-20 bg-linear-to-l from-transparent to-blue-300" />
        </div>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <ServiceCard
            icon={CalendarClock}
            eyebrow="Nova solicitação"
            title="Agendamento de amostras"
            description="Cadastre os exames desejados, selecione data e horário e receba o protocolo da sua solicitação ao final do envio."
            bullets={[
              "Formulário guiado em poucos passos",
              "Protocolo gerado automaticamente",
              "Confirmação imediata da solicitação",
            ]}
            ctaHref="/agendamento"
            ctaLabel="Agendar amostra"
          />
          <ProtocolLookupCard />
        </div>
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
          Portal do pesquisador · Pesquisa clínica e gestão de amostras
        </p>
      </div>
    </footer>
  );
}
