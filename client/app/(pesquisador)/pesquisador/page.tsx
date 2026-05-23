import { ArrowRight, CalendarClock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProtocolLookupCard } from "@/components/protocol-lookup-card";
import { ServiceCard } from "@/components/service-card";
import { SiteHeader } from "@/components/header";

export const metadata = {
  title: "Portal do pesquisador — LIACLI",
  description:
    "Agende amostras e consulte protocolos com segurança e rastreabilidade.",
};

export default function ResearcherHome() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader profile="Pesquisador" hasLoginButton={false} />
      <main id="conteudo" className="flex-1">
        <HeroSection />
        <ServicesSection />
        <TrustSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
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

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
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
      className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24"
    >
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Serviços disponíveis
        </span>
        <h2
          id="servicos-title"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          O que você pode fazer agora
        </h2>
        <p className="text-base text-muted-foreground">
          Escolha um dos serviços abaixo para iniciar uma nova solicitação ou
          acompanhar uma já em andamento.
        </p>
      </div>

      <div className="mt-12 flex gap-6">
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
    </section>
  );
}

const trustItems = [
  {
    title: "Rastreabilidade ponta a ponta",
    description:
      "Acompanhe cada amostra desde o agendamento até a liberação do laudo, com histórico completo de cada etapa.",
  },
  {
    title: "Segurança e conformidade",
    description:
      "Dados protegidos e fluxos validados de acordo com os requisitos da rotina laboratorial e da pesquisa clínica.",
  },
  {
    title: "Experiência pensada para você",
    description:
      "Interface clara e objetiva, focada no que importa para o pesquisador no dia a dia.",
  },
];

function TrustSection() {
  return (
    <section
      id="confianca"
      aria-labelledby="confianca-title"
      className="border-t border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2
            id="confianca-title"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Construído para a rotina da pesquisa clínica
          </h2>
          <p className="text-base text-muted-foreground">
            Uma plataforma desenhada para reduzir retrabalho e dar visibilidade
            ao processo analítico.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span
                aria-hidden
                className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
              >
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
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
          Portal do pesquisador · Pesquisa clínica e gestão de amostras
        </p>
      </div>
    </footer>
  );
}
