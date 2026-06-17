"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  Microscope,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/header";

const features = [
  {
    icon: Microscope,
    title: "Solicitação e agendamento simplificados",
    description:
      "Pesquisadores enviam solicitações online e acompanham aprovações sem trocas de e-mail avulsas.",
  },
  {
    icon: Activity,
    title: "Acompanhamento em tempo real por protocolo",
    description:
      "Cada solicitação gera um protocolo único para rastrear todas as etapas, da submissão à conclusão da análise.",
  },
  {
    icon: FileCheck2,
    title: "Resultados gerados automaticamente",
    description:
      "Ao concluir a análise, o laudo é gerado e disponibilizado para download direto no sistema.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative min-h-screen overflow-hidden text-white">
          {/* Background image */}
          <Image
            src="/labratory-image.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            aria-hidden
          />

          {/* Blue overlay — two layers for depth and vignette */}
          <div aria-hidden className="absolute inset-0 bg-blue-950/65" />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-blue-950/10 to-slate-950/40"
          />

          {/* Decorative glow accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 size-112 rounded-full bg-blue-400/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-40 size-112 rounded-full bg-blue-600/10 blur-3xl"
          />

          {/* Content */}
          <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
              <ShieldCheck className="size-3.5" aria-hidden />
              Sistema homologado para laboratórios clínicos
            </span>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Gestão completa das suas análises clínicas
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base text-white/75 sm:text-lg">
              Controle exames, acompanhe resultados e otimize o fluxo do seu
              laboratório com eficiência e segurança.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 px-5 text-sm font-semibold"
              >
                <Link href="/pesquisador">
                  Sou pesquisador
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-white/20 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Sou funcionário</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-background py-24 sm:py-32"
          id="servicos"
        >
          {/* Subtle blue top-fade and radial glow for section identity */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-blue-50/70 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 size-140 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-400/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            {/* Section header */}
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
                Nossa Plataforma
              </span>

              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Do pedido ao laudo,{" "}
                <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  tudo conectado
                </span>
              </h2>

              <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Reduza retrabalho e ganhe rastreabilidade em todas as etapas do
                processo analítico.
              </p>
            </div>

            {/* Decorative divider */}
            <div
              aria-hidden
              className="mx-auto mt-10 flex items-center justify-center gap-2"
            >
              <div className="h-px w-16 bg-linear-to-r from-transparent to-blue-300" />
              <div className="size-1.5 rounded-full bg-blue-400" />
              <div className="h-px w-16 bg-linear-to-l from-transparent to-blue-300" />
            </div>

            {/* Feature cards */}
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <li
                  key={feature.title}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-100/50"
                >
                  {/* Decorative index — purely ornamental */}
                  <span
                    aria-hidden
                    className="absolute right-6 top-5 select-none text-4xl font-black tabular-nums leading-none text-slate-100"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon with blue gradient */}
                  <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-sm shadow-blue-200/60">
                    <feature.icon className="size-5" aria-hidden />
                  </div>

                  <h3 className="mt-5 pr-8 text-base font-semibold leading-snug text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>

                  {/* Bottom accent line that expands on hover */}
                  <div className="mt-6 h-px w-8 rounded-full bg-linear-to-r from-blue-500 to-blue-300 opacity-0 transition-all duration-500 group-hover:w-12 group-hover:opacity-100" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-sidebar text-sidebar-foreground/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} LIACLI — Gestão laboratorial</p>
          <p className="text-sidebar-foreground/50">
            Feito para clínicas e centros de pesquisa
          </p>
        </div>
      </footer>
    </div>
  );
}
