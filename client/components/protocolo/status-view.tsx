import {
  ArrowLeft,
  CalendarClock,
  Clock,
  Download,
  FileCheck2,
  FlaskConical,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EXAM_LABELS } from "../../app/(pesquisador)/protocolo/[codigo]/_lib/mock";
import type { AppointmentData } from "../../app/(pesquisador)/protocolo/[codigo]/_lib/types";
import { AgendamentoBadge, AnaliseBadge } from "./status-badge";
import { Timeline } from "./timeline";

/* ── Section wrapper ─────────────────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`section-${title.replace(/\s/g, "-").toLowerCase()}`}
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className ?? ""}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-accent" aria-hidden />
        <h2
          id={`section-${title.replace(/\s/g, "-").toLowerCase()}`}
          className="text-sm font-semibold text-foreground"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* ── Status overview card ────────────────────────────────────────── */

function StatusCard({ data }: { data: AppointmentData }) {
  const stats = [
    {
      label: "Agendamento",
      value: <AgendamentoBadge status={data.agendamentoStatus} size="lg" />,
    },
    {
      label: "Análise",
      value: <AnaliseBadge status={data.analiseStatus} size="lg" />,
    },
    {
      label: "Semana de envio",
      value: (
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <CalendarClock className="size-4 text-muted-foreground" aria-hidden />
          {data.semana}
        </span>
      ),
    },
    {
      label: "Amostras",
      value: (
        <span className="text-sm font-medium">
          {data.amostras.length} {data.amostras.length === 1 ? "lote" : "lotes"}
          {" · "}
          {data.amostras.reduce((s, a) => s + a.totalAnimais, 0)} animais
        </span>
      ),
    },
  ];

  return (
    <Section icon={ShieldCheck} title="Visão geral da solicitação">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="space-y-1.5">
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <Separator className="my-4" />

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          Enviado em {data.dataSubmissao}
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="size-3.5" aria-hidden />
          Última atualização: {data.ultimaAtualizacao}
        </span>
      </div>
    </Section>
  );
}

/* ── Researcher info ─────────────────────────────────────────────── */

function ResearcherInfo({
  pesquisador,
}: {
  pesquisador: AppointmentData["pesquisador"];
}) {
  const fields = [
    { icon: User, label: "Nome", value: pesquisador.nome },
    { icon: Mail, label: "E-mail", value: pesquisador.email },
    ...(pesquisador.telefone
      ? [{ icon: Phone, label: "Telefone", value: pesquisador.telefone }]
      : []),
    ...(pesquisador.orientador
      ? [{ icon: User, label: "Orientador", value: pesquisador.orientador }]
      : []),
    { icon: Info, label: "Nível acadêmico", value: pesquisador.nivel },
    {
      icon: FileCheck2,
      label: "Título do projeto",
      value: pesquisador.tituloProjeto,
    },
    ...(pesquisador.cursoPrograma
      ? [
          {
            icon: Info,
            label: "Curso / Programa",
            value: pesquisador.cursoPrograma,
          },
        ]
      : []),
    ...(pesquisador.laboratorio
      ? [
          {
            icon: FlaskConical,
            label: "Laboratório",
            value: pesquisador.laboratorio,
          },
        ]
      : []),
  ];

  return (
    <Section icon={User} title="Dados do pesquisador">
      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="space-y-0.5">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3" aria-hidden />
              {label}
            </dt>
            <dd className="text-sm font-medium text-foreground leading-snug">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ── Samples ─────────────────────────────────────────────────────── */

function SampleCard({
  sample,
  index,
}: {
  sample: AppointmentData["amostras"][number];
  index: number;
}) {
  return (
    <article className="rounded-xl border border-border bg-background p-4 space-y-3">
      <header className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          {sample.especieAnimal}
        </h3>
      </header>

      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Total de animais</dt>
          <dd className="font-medium text-foreground">{sample.totalAnimais}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Previsão de remessas</dt>
          <dd className="font-medium text-foreground">
            {sample.previsaoRemessas}
          </dd>
        </div>
      </dl>

      <div>
        <p className="mb-1.5 text-xs text-muted-foreground">
          Exames solicitados
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sample.exames.map((id) => (
            <span
              key={id}
              className="inline-flex h-5 items-center rounded-full bg-primary/8 px-2 text-xs font-medium text-primary"
            >
              {EXAM_LABELS[id] ?? id}
            </span>
          ))}
          {sample.outroExame && (
            <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
              {sample.outroExame}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function SamplesSection({
  amostras,
}: {
  amostras: AppointmentData["amostras"];
}) {
  return (
    <Section icon={FlaskConical} title="Amostras solicitadas">
      <div className="space-y-3">
        {amostras.map((s, i) => (
          <SampleCard key={s.id} sample={s} index={i} />
        ))}
      </div>
    </Section>
  );
}

/* ── Report section ──────────────────────────────────────────────── */

function ReportSection({ laudoUrl }: { laudoUrl: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-success/30 bg-success/5 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
          <FileCheck2 className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Laudo disponível para download
          </p>
          <p className="text-xs text-muted-foreground">
            O laudo técnico foi emitido e está disponível para consulta.
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0">
        <a href={laudoUrl} download>
          <Download className="size-4" aria-hidden />
          Baixar laudo
        </a>
      </Button>
    </div>
  );
}

/* ── Pending new state ───────────────────────────────────────────── */

export function PendingNewView({ protocolo }: { protocolo: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-warning/10 text-warning-foreground">
          <Clock className="size-8" aria-hidden />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Solicitação recebida</h1>
          <p className="text-muted-foreground">
            A solicitação vinculada ao protocolo{" "}
            <strong className="font-mono text-foreground">{protocolo}</strong>{" "}
            foi registrada com sucesso e está aguardando análise pela equipe
            LIACLI. Você receberá atualizações em breve.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-5 space-y-1 text-left text-sm">
          <p className="font-semibold text-foreground">Próximos passos</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground text-xs">
            <li>→ A equipe LIACLI analisará sua solicitação</li>
            <li>
              → O agendamento será confirmado ou ajustado conforme
              disponibilidade
            </li>
            <li>
              → Retorne a esta página com o mesmo protocolo para acompanhar
            </li>
          </ul>
        </div>
        <Button asChild variant="outline">
          <Link href="/pesquisador">
            <ArrowLeft className="size-4" aria-hidden />
            Voltar ao portal
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ── Main StatusView ─────────────────────────────────────────────── */

export function StatusView({ data }: { data: AppointmentData }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {data.laudoUrl && <ReportSection laudoUrl={data.laudoUrl} />}

      <div
        className={`grid gap-8 lg:grid-cols-[1fr_340px] ${data.laudoUrl ? "mt-6" : ""}`}
      >
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          <StatusCard data={data} />
          <ResearcherInfo pesquisador={data.pesquisador} />
          <SamplesSection amostras={data.amostras} />

          {data.observacoes && (
            <Section icon={Info} title="Observações do pesquisador">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.observacoes}
              </p>
            </Section>
          )}
        </div>

        {/* Right sidebar — Timeline */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Clock className="size-4 text-accent" aria-hidden />
              <h2 className="text-sm font-semibold text-foreground">
                Histórico de atualizações
              </h2>
            </div>
            <Timeline events={data.timeline} />
          </div>
        </aside>
      </div>
    </div>
  );
}
