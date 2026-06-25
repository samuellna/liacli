import { Search } from "lucide-react";

import { BackLink } from "@/components/back-link";
import {
  AgendamentoBadge,
  AnaliseBadge,
} from "@/components/protocolo/status-badge";
import { NotFound } from "@/components/protocolo/not-found";
import { PendingNewView, StatusView } from "@/components/protocolo/status-view";
import { findSampleByProtocol } from "@/api/samples";
import { ApprovalStatus, Sample, SampleStatus } from "@/api/types";

type PageProps = {
  params: Promise<{ codigo: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { codigo } = await params;
  return {
    title: `Consulta de protocolo ${codigo.toUpperCase()} — LIACLI`,
    description: "Acompanhe o status do seu agendamento de amostras.",
  };
}

export default async function ConsultStatusPage({ params }: PageProps) {
  const { codigo } = await params;
  let result: Sample | null;
  try {
    result = await findSampleByProtocol(codigo);
  } catch (error) {
    console.error("Error fetching sample by protocol:", error);
    result = null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">
        {result?.approvalStatus === "APPROVED" && (
          <>
            <HeroSection
              protocolo={result.protocol}
              agendamentoStatus={result.approvalStatus}
              analiseStatus={result.status}
              ultimaAtualizacao={new Date(result.updatedAt).toLocaleString(
                "pt-BR",
              )}
            />
            <StatusView data={result} />
            <SiteFooter />
          </>
        )}

        {result?.approvalStatus === "PENDING" && (
          <>
            <HeroSection
              protocolo={result.protocol}
              agendamentoStatus={result.approvalStatus}
              analiseStatus={result.status}
              ultimaAtualizacao={new Date(result.updatedAt).toLocaleString(
                "pt-BR",
              )}
            />
            <PendingNewView protocolo={result.protocol} />
            <SiteFooter />
          </>
        )}

        {result?.approvalStatus === "REJECTED" && (
          <>
            <HeroSection
              protocolo={result.protocol}
              agendamentoStatus={result.approvalStatus}
              analiseStatus={result.status}
              ultimaAtualizacao={new Date(result.updatedAt).toLocaleString(
                "pt-BR",
              )}
            />
            <StatusView data={result} />
            <SiteFooter />
          </>
        )}

        {!result && <NotFound protocol={codigo} />}
      </main>
    </div>
  );
}

function HeroSection({
  protocolo,
  agendamentoStatus,
  analiseStatus,
  ultimaAtualizacao,
}: {
  protocolo: string;
  agendamentoStatus: ApprovalStatus;
  analiseStatus: SampleStatus;
  ultimaAtualizacao: string;
}) {
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

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <BackLink
          href="/pesquisador"
          className="mb-4 text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          Voltar ao portal
        </BackLink>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
              <Search className="size-3.5" aria-hidden />
              Consulta de solicitação
            </span>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Acompanhamento de agendamento
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-sidebar-foreground/70">
                Protocolo:
              </span>
              <span className="font-mono text-base font-bold tracking-[0.18em] text-sidebar-foreground">
                {protocolo.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <AgendamentoBadge status={agendamentoStatus} size="md" />
              <AnaliseBadge status={analiseStatus} size="md" />
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs">
            <p className="text-sidebar-foreground/60">Última atualização</p>
            <p className="mt-0.5 font-medium text-sidebar-foreground">
              {ultimaAtualizacao}
            </p>
          </div>
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
          Sistema homologado para laboratórios clínicos
        </p>
      </div>
    </footer>
  );
}
