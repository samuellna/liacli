"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Beaker,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  StickyNote,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { AnaliseBadge } from "@/components/protocolo/status-badge";
import { findAllEmployees } from "@/api/employees";
import { approveSample, findSampleById } from "@/api/samples";
import { ApprovalStatus } from "@/api/types";
import type { ExamType, Sample } from "@/api/types";

import { ModalAtualizar } from "../_components/modal-atualizar";
import {
  formatarData,
  researchLevelLabel,
  statusClass,
  statusRotulo,
  statusVariant,
  StatusIcon,
} from "../_lib/helpers";

// ─── InfoField ────────────────────────────────────────────────────────────────

function InfoField({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── Card de exame solicitado ─────────────────────────────────────────────────

function ExameCard({ exame }: { exame: ExamType }) {
  const groups = exame.groups ?? [];

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
      <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
        <CardTitle className="text-base font-semibold text-foreground">
          {exame.name}
        </CardTitle>
        {exame.material && (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Beaker className="size-3.5" aria-hidden />
            {exame.material}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-5 pb-4">
        {exame.description && (
          <p className="text-sm text-foreground/80">{exame.description}</p>
        )}

        {groups.map((group) => (
          <div
            key={group.groupName ?? "default"}
            className="overflow-hidden rounded-lg border border-border/60"
          >
            {group.groupName && (
              <div className="border-b bg-primary/5 px-4 py-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
                  {group.groupName}
                </p>
              </div>
            )}
            <div className="divide-y divide-border/50">
              {group.parameters.map((param) => (
                <div
                  key={param.name}
                  className="flex items-center justify-between gap-4 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-foreground">
                    {param.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {param.reference ? `Ref: ${param.reference}` : "—"}
                    {param.unit ? ` ${param.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {exame.observations && (
          <div className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
            <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <StickyNote className="size-3" aria-hidden />
              Observações
            </p>
            <p className="text-sm text-foreground/80">{exame.observations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card
            key={i}
            className="overflow-hidden border border-border/60 shadow-sm"
          >
            <div className="border-b bg-primary/5 p-4">
              <Skeleton className="h-3.5 w-24" />
            </div>
            <CardContent className="grid gap-4 pt-5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DetalhesSolicitacaoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const sampleId = Number(id);

  const [sample, setSample] = useState<Sample | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (!sampleId || isNaN(sampleId)) {
      setLoadError("ID de solicitação inválido.");
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [data, employees] = await Promise.all([
          findSampleById(sampleId),
          findAllEmployees(),
        ]);
        setSample(data);
        if (employees.length > 0) {
          setCurrentEmployeeId(employees[0].id);
        }
      } catch {
        setLoadError("Não foi possível carregar os dados da solicitação.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [sampleId]);

  async function confirmarAtualizacao(
    decisionId: number,
    aprovado: boolean,
    observacao: string,
  ) {
    if (currentEmployeeId === null) {
      toast.error("Nenhum funcionário disponível para registrar a decisão.");
      throw new Error("no_employee");
    }
    try {
      await approveSample(decisionId, {
        approved: aprovado,
        employeeId: currentEmployeeId,
        decisionReason: observacao || undefined,
      });
      setModalAberto(false);
      toast.success(
        aprovado
          ? "Solicitação aprovada com sucesso."
          : "Solicitação rejeitada e registrada.",
      );
      router.push("/solicitacoes");
    } catch (err) {
      if ((err as Error).message !== "no_employee") {
        toast.error(
          "Não foi possível processar a solicitação. Tente novamente.",
        );
      }
      throw err;
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (isLoading) return <PageSkeleton />;

  // ── Error ────────────────────────────────────────────────────────────────────

  if (loadError || !sample) {
    return (
      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/solicitacoes")}
              aria-label="Voltar"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
                <FileText
                  className="size-5 text-primary-foreground"
                  aria-hidden
                />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Detalhes da Solicitação
              </h1>
            </div>
          </div>
        </header>
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {loadError ?? "Solicitação não encontrada."}
              </p>
              <p className="text-xs text-muted-foreground">
                Verifique o identificador e tente novamente.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/solicitacoes")}
            >
              Voltar para solicitações
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const { researchProject } = sample;
  const researcher = researchProject.researcher;
  const ApprovalIcon = StatusIcon[sample.approvalStatus];
  const numExames = researchProject.examTypes.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1.5 gap-1.5 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/solicitacoes">
            <ArrowLeft className="size-4" />
            Voltar para solicitações
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
              <FileText
                className="size-5 text-primary-foreground"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Detalhes da Solicitação
              </h1>
              <p className="font-mono text-sm text-muted-foreground">
                {sample.protocol}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusVariant[sample.approvalStatus]}
              className={statusClass[sample.approvalStatus]}
            >
              <ApprovalIcon className="size-3.5" aria-hidden />
              {statusRotulo[sample.approvalStatus]}
            </Badge>
            <AnaliseBadge status={sample.status} size="md" />
          </div>
        </div>
      </header>

      {/* Info cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Solicitação */}
        <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
          <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
            <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
              Solicitação
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 pb-4 sm:grid-cols-2">
            <InfoField label="Protocolo" value={sample.protocol} mono />
            <InfoField
              label="Animais nesta remessa"
              value={sample.animalsInThisShipment}
            />
            <InfoField
              label="Solicitado em"
              value={formatarData(sample.createdAt)}
            />
            <InfoField
              label="Agendamento"
              value={formatarData(sample.scheduledAt)}
            />
            {sample.approvalStatus !== ApprovalStatus.PENDING && (
              <>
                <InfoField
                  label="Avaliado por"
                  value={sample.approvedBy?.name}
                />
                <InfoField
                  label="Avaliado em"
                  value={formatarData(sample.approvedAt)}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Pesquisador */}
        <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
          <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
            <CardTitle className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary/70">
              <Users className="size-3.5" aria-hidden />
              Pesquisador
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 pb-4 sm:grid-cols-2">
            <InfoField label="Nome" value={researcher.name} />
            <InfoField
              label="E-mail"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                  {researcher.email}
                </span>
              }
            />
            <InfoField
              label="Telefone"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" aria-hidden />
                  {researcher.phone}
                </span>
              }
            />
            <InfoField
              label="Instituição"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Building2
                    className="size-3.5 text-muted-foreground"
                    aria-hidden
                  />
                  {researcher.institution}
                </span>
              }
            />
            <InfoField label="Orientador" value={researcher.advisorName} />
            <InfoField
              label="Nível"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap
                    className="size-3.5 text-muted-foreground"
                    aria-hidden
                  />
                  {researchLevelLabel[researcher.level] ?? researcher.level}
                </span>
              }
            />
            <InfoField
              label="Cadastrado em"
              value={formatarData(researcher.createdAt)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Projeto de pesquisa */}
      <Card className="overflow-hidden border border-border/60 shadow-sm py-0">
        <CardHeader className="border-b bg-linear-to-r from-primary/5 via-background to-accent/5 py-4">
          <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
            Projeto de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-5 pb-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoField
            label="Título"
            value={<span className="sm:col-span-2">{researchProject.title}</span>}
          />
          <InfoField label="Curso" value={researchProject.course} />
          <InfoField
            label="Laboratório"
            value={researchProject.researchLab}
          />
          <InfoField
            label="Espécie animal"
            value={researchProject.animalSpecies}
          />
          <InfoField
            label="Total de animais"
            value={researchProject.totalAnimals}
          />
          <InfoField
            label="Embarques previstos"
            value={researchProject.expectedShipments}
          />
          <InfoField
            label="Data preferida"
            value={
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
                {formatarData(researchProject.preferredDate)}
              </span>
            }
          />
          {researchProject.observations && (
            <div className="space-y-0.5 sm:col-span-2 lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Observações
              </p>
              <p className="text-sm font-medium text-foreground">
                {researchProject.observations}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="bg-border/50" />

      {/* Exames solicitados */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Exames Solicitados
          </h2>
          <Badge className="h-6 gap-1.5 border-primary/30 bg-primary/8 px-3 text-xs text-primary">
            {numExames} {numExames === 1 ? "exame" : "exames"}
          </Badge>
        </div>

        {researchProject.examTypes.map((exame) => (
          <ExameCard key={exame.id} exame={exame} />
        ))}
      </section>

      {/* Ações */}
      {sample.approvalStatus === ApprovalStatus.PENDING && (
        <div className="flex justify-end border-t border-border/50 pt-6">
          <Button
            onClick={() => setModalAberto(true)}
            className="gap-2 border-primary/30 bg-primary/5 text-primary hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            variant="outline"
          >
            <RefreshCw className="size-4" aria-hidden />
            Avaliar solicitação
          </Button>
        </div>
      )}

      <ModalAtualizar
        solicitacao={{
          id: sample.id,
          protocolo: sample.protocol,
          pesquisador: researcher.name,
        }}
        open={modalAberto}
        onOpenChange={setModalAberto}
        onConfirmar={confirmarAtualizacao}
      />
    </div>
  );
}
