import {
  ArrowLeft,
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

import { AgendamentoBadge, AnaliseBadge } from "./status-badge";
import { Timeline } from "./timeline";
import { ApprovalStatus, Sample, SampleStatus } from "@/api/types";
import type { TimelineEvent } from "../../app/(pesquisador)/protocolo/[codigo]/_lib/types";

function convertAcademicLevel(level: string) {
  switch (level) {
    case "SCIENTIFIC_INITIATION":
      return "Iniciação científica";
    case "MASTERS":
      return "Mestrado";
    case "DOCTORATE":
      return "Doutorado";
    case "POST_DOCTORATE":
      return "Pós-doutorado";
    default:
      return "Outro";
  }
}
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

function StatusCard({ data }: { data: Sample }) {
  const createdAt = data.researchProject?.createdAt;
  const createdAtLabel = createdAt
    ? new Date(createdAt).toLocaleDateString("pt-BR")
    : "—";

  const updatedAt = data.researchProject?.updatedAt;
  const updatedAtLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString("pt-BR")
    : "—";

  const stats = [
    {
      label: "Agendamento",
      value: <AgendamentoBadge status={data.approvalStatus} size="lg" />,
    },
    {
      label: "Análise",
      value: <AnaliseBadge status={data.status} size="lg" />,
    },
    {
      label: "Amostras",
      value: (
        <span className="text-sm font-medium">
          {data.researchProject?.expectedShipments ?? "—"} remessas
          {data.researchProject?.totalAnimals
            ? ` · ${data.researchProject.totalAnimals} animais`
            : ""}
        </span>
      ),
    },
  ];

  return (
    <Section icon={ShieldCheck} title="Visão geral da solicitação">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          Enviado em {createdAtLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="size-3.5" aria-hidden />
          Última atualização: {updatedAtLabel}
        </span>
      </div>
    </Section>
  );
}

/* ── Researcher info ─────────────────────────────────────────────── */

function ResearcherInfo({ info }: { info: Sample }) {
  const fields = [
    { icon: User, label: "Nome", value: info.researchProject.researcher.name },
    {
      icon: Mail,
      label: "E-mail",
      value: info.researchProject.researcher.email,
    },
    ...(info.researchProject.researcher.phone
      ? [
          {
            icon: Phone,
            label: "Telefone",
            value: info.researchProject.researcher.phone,
          },
        ]
      : []),
    ...(info.researchProject.researcher.advisorName
      ? [
          {
            icon: User,
            label: "Orientador",
            value: info.researchProject.researcher.advisorName,
          },
        ]
      : []),
    {
      icon: Info,
      label: "Nível acadêmico",
      value: convertAcademicLevel(info.researchProject.researcher.level),
    },
    {
      icon: FileCheck2,
      label: "Título do projeto",
      value: info.researchProject?.title ?? "—",
    },
    ...(info.researchProject?.course
      ? [
          {
            icon: Info,
            label: "Curso / Programa",
            value: info.researchProject.course,
          },
        ]
      : []),
    ...(info.researchProject?.researchLab
      ? [
          {
            icon: FlaskConical,
            label: "Laboratório",
            value: info.researchProject.researchLab,
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

function SampleCard({ sample, index }: { sample: Sample; index: number }) {
  return (
    <article className="rounded-xl border border-border bg-background p-4 space-y-3">
      <header className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          {sample.researchProject?.animalSpecies ?? "Amostra"}
        </h3>
      </header>

      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Total de animais</dt>
          <dd className="font-medium text-foreground">
            {sample.researchProject?.totalAnimals}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Previsão de remessas</dt>
          <dd className="font-medium text-foreground">
            {sample.researchProject?.expectedShipments ?? "—"}
          </dd>
        </div>
      </dl>

      <div>
        <p className="mb-1.5 text-xs text-muted-foreground">
          Exames solicitados
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sample.researchProject?.examTypes.map((e) => (
            <span
              key={e.id}
              className="inline-flex h-5 items-center rounded-full bg-primary/8 px-2 text-xs font-medium text-primary"
            >
              {e.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function SamplesSection({ amostras }: { amostras: Sample }) {
  return (
    <Section icon={FlaskConical} title="Amostras solicitadas">
      <SampleCard sample={amostras} index={0} />
    </Section>
  );
}

/* ── Report section ──────────────────────────────────────────────── */

function ReportSection({ resultId }: { resultId: number }) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const pdfUrl = `${base}/results/${resultId}/pdf`;

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
        <a href={pdfUrl} download>
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

/* ── Timeline builder ────────────────────────────────────────────── */

function buildTimeline(sample: Sample): TimelineEvent[] {
  const { approvalStatus, status, createdAt, approvedAt, updatedAt } = sample;

  const fmt = (d: Date | string | null | undefined): string =>
    d ? new Date(d as string).toLocaleDateString("pt-BR") : "Aguardando";

  const approved = approvalStatus === ApprovalStatus.APPROVED;
  const rejectedApproval = approvalStatus === ApprovalStatus.REJECTED;
  const rejectedSample = status === SampleStatus.REJECTED;
  const collected = [
    SampleStatus.COLLECTED,
    SampleStatus.ANALYZING,
    SampleStatus.DONE,
  ].includes(status);
  const done = status === SampleStatus.DONE;

  const events: TimelineEvent[] = [
    {
      id: "enviada",
      icon: "send",
      label: "Solicitação enviada",
      description: "Solicitação registrada com sucesso.",
      date: fmt(createdAt),
      completed: true,
      current: false,
    },
    {
      id: "agendamento",
      icon: rejectedApproval ? "x-circle" : "calendar-check",
      label: rejectedApproval
        ? "Solicitação rejeitada"
        : "Agendamento aprovado",
      description: rejectedApproval
        ? "A equipe LIACLI não pôde aprovar esta solicitação. Detalhes no e-mail cadastrado."
        : approved
          ? "A equipe LIACLI analisou e aprovou o agendamento."
          : "Aguardando análise pela equipe LIACLI.",
      date: approved || rejectedApproval ? fmt(approvedAt) : "Aguardando",
      completed: approved,
      current: !approved,
    },
  ];

  if (rejectedApproval) return events;

  events.push({
    id: "coletada",
    icon: rejectedSample ? "x-circle" : "package",
    label: rejectedSample ? "Coleta rejeitada" : "Amostra coletada",
    description: rejectedSample
      ? "Houve um problema com o recebimento da amostra."
      : collected
        ? "A amostra foi recebida pelo laboratório."
        : "Aguardando o recebimento da amostra.",
    date: collected || rejectedSample ? fmt(updatedAt) : "Aguardando",
    completed: collected,
    current: (approved && status === SampleStatus.PENDING) || rejectedSample,
  });

  if (rejectedSample) return events;

  events.push({
    id: "analisando",
    icon: "microscope",
    label: "Em análise",
    description: done
      ? "A análise foi concluída."
      : collected
        ? "A amostra está sendo analisada no laboratório."
        : "Aguardando início da análise.",
    date: collected ? fmt(updatedAt) : "Aguardando",
    completed: done,
    current: collected && !done,
  });

  events.push({
    id: "concluido",
    icon: "file-check",
    label: "Resultado disponível",
    description: done
      ? "O laudo técnico foi emitido e está disponível para download."
      : "Aguardando conclusão da análise.",
    date: done ? fmt(updatedAt) : "Aguardando",
    completed: done,
    current: done,
  });

  return events;
}

/* ── Main StatusView ─────────────────────────────────────────────── */

export function StatusView({ data }: { data: Sample }) {
  const firstResult = data.results?.[0];
  const showReport = data.status === SampleStatus.DONE && firstResult != null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {showReport && <ReportSection resultId={firstResult!.id} />}

      <div
        className={`grid gap-8 lg:grid-cols-[1fr_340px] ${showReport ? "mt-6" : ""}`}
      >
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          <StatusCard data={data} />
          <ResearcherInfo info={data} />
          <SamplesSection amostras={data} />

          {data.researchProject?.observations && (
            <Section icon={Info} title="Observações do pesquisador">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.researchProject.observations}
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
            <Timeline events={buildTimeline(data)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
