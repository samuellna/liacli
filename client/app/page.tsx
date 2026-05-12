"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  FlaskConical,
  LogIn,
  Microscope,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Microscope,
    title: "Cadastro de amostras",
    description:
      "Registre amostras, vincule pesquisadores e acompanhe o protocolo do recebimento à liberação.",
  },
  {
    icon: Activity,
    title: "Resultados em tempo real",
    description:
      "Acompanhe o status de cada exame, com filtros e visão consolidada da operação.",
  },
  {
    icon: FileCheck2,
    title: "Laudos com rastreabilidade",
    description:
      "Emita e versione laudos clínicos com histórico completo e download seguro.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="LIACLI — página inicial"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FlaskConical className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold tracking-wide">LIACLI</span>
          </Link>

          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="size-4" aria-hidden />
              Entrar
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 size-112 rounded-full bg-primary/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-40 size-112 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
                <ShieldCheck className="size-3.5" aria-hidden />
                Sistema homologado para laboratórios clínicos
              </span>
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Gestão completa das suas análises clínicas
              </h1>
              <p className="mx-auto max-w-md text-pretty text-base text-sidebar-foreground/80 sm:text-lg lg:mx-0">
                Controle exames, acompanhe resultados e otimize o fluxo do seu
                laboratório com eficiência e segurança.
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-5 text-sm font-semibold"
                >
                  <Link
                    href="/login?role=pesquisador"
                    onClick={() => console.log("Fluxo do pesquisador")}
                  >
                    Sou pesquisador
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 border-white/20 bg-white/5 px-5 text-sm font-semibold text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground"
                >
                  <Link
                    href="/login?role=funcionario"
                    onClick={() => console.log("Fluxo do funcionário")}
                  >
                    Sou funcionário
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="/labratory-image.jpeg"
                  alt="Equipe técnica trabalhando em laboratório de análises clínicas"
                  fill
                  sizes="(min-width: 1024px) 32rem, (min-width: 640px) 70vw, 90vw"
                  className="object-cover"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-sidebar/80 via-sidebar/10 to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Sobre nós</h2>
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
