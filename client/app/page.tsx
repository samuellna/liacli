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
                <Link href="/login?role=funcionario">Sou funcionário</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16 sm:px-6">
          <div className="w-full">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Sobre nós
              </h2>
              <p className="text-base text-muted-foreground">
                Reduza retrabalho e ganhe rastreabilidade em todas as etapas do
                processo analítico.
              </p>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-accent/40"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
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
