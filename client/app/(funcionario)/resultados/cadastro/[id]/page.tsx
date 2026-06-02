"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, FlaskConical } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { findTemplate, type GrupoExame } from "../_lib/exam-parameters";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusAmostra = "Pendente" | "Em análise" | "Concluído";

type Exame = { id: number; nome: string };

type Amostra = {
  codigo: string;
  protocolo: string;
  pesquisador: string;
  dataAgendamento: string;
  status: StatusAmostra;
  exames: Exame[];
};

// ─── Mock ─────────────────────────────────────────────────────────────────────

const amostrasMock: Record<string, Amostra> = {
  AM001: {
    codigo: "AM001",
    protocolo: "A1B2C3",
    pesquisador: "João Silva",
    dataAgendamento: "20/05/2026",
    status: "Em análise",
    exames: [{ id: 1, nome: "Glicemia" }],
  },
  AM002: {
    codigo: "AM002",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    dataAgendamento: "08/05/2026",
    status: "Concluído",
    exames: [{ id: 1, nome: "Hemograma" }],
  },
  AM003: {
    codigo: "AM003",
    protocolo: "D4E5F6",
    pesquisador: "Maria Souza",
    dataAgendamento: "08/05/2026",
    status: "Pendente",
    exames: [{ id: 1, nome: "Hemograma" }],
  },
  AM004: {
    codigo: "AM004",
    protocolo: "G7H8I9",
    pesquisador: "Carlos Melo",
    dataAgendamento: "15/05/2026",
    status: "Em análise",
    exames: [
      { id: 1, nome: "Hemograma" },
      { id: 2, nome: "Glicemia" },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusClass: Record<StatusAmostra, string> = {
  Pendente:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  "Em análise": "border-info/40 bg-info/15 text-info dark:text-info",
  Concluído: "border-success/40 bg-success/15 text-success dark:text-success",
};

// ─── Estado do formulário ─────────────────────────────────────────────────────

type FormState = Record<
  number,
  {
    parametros: Record<string, Record<string, string>>;
    observacoes: string;
    valorGenerico: string;
  }
>;

function buildInitialState(exames: Exame[]): FormState {
  const state: FormState = {};
  for (const exame of exames) {
    const template = findTemplate(exame.nome);
    const parametros: Record<string, Record<string, string>> = {};
    if (template) {
      for (const grupo of template.grupos) {
        parametros[grupo.id] = {};
        for (const param of grupo.parametros) {
          parametros[grupo.id][param.id] = "";
        }
      }
    }
    state[exame.id] = { parametros, observacoes: "", valorGenerico: "" };
  }
  return state;
}

// ─── Sub-componente: grupo de parâmetros ──────────────────────────────────────

function GrupoParametros({
  grupo,
  valores,
  onChangeParam,
}: {
  grupo: GrupoExame;
  valores: Record<string, string>;
  onChangeParam: (paramId: string, value: string) => void;
}) {
  return (
    <div className="rounded-md border">
      <div className="border-b bg-muted/40 px-4 py-2.5">
        <p className="text-sm font-semibold">{grupo.nome}</p>
        {grupo.metodo && (
          <p className="text-xs text-muted-foreground">Método: {grupo.metodo}</p>
        )}
      </div>

      <div className="divide-y">
        {grupo.parametros.map((param) => (
          <div
            key={param.id}
            className="grid grid-cols-1 items-start gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <p className="text-sm font-medium">{param.nome}</p>
              {param.referencia && (
                <p className="text-xs text-muted-foreground">
                  Ref: {param.referencia}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type={param.tipo}
                step={param.tipo === "number" ? "0.01" : undefined}
                placeholder="—"
                value={valores[param.id] ?? ""}
                onChange={(e) => onChangeParam(param.id, e.target.value)}
                className="w-36"
              />
              {param.unidade !== "—" && (
                <span className="shrink-0 text-sm text-muted-foreground">
                  {param.unidade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Not found ────────────────────────────────────────────────────────────────

function AmostraNaoEncontrada({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <ClipboardCheck className="size-6" />
          Cadastro de Resultados
        </h1>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <FlaskConical className="size-10 text-muted-foreground/40" aria-hidden />
          <p className="text-sm font-medium">
            Amostra <span className="font-mono">{id}</span> não encontrada.
          </p>
          <p className="text-xs text-muted-foreground">
            Verifique o código e tente novamente.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/amostras")}
          >
            Voltar para amostras
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CadastroResultadoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const amostra = amostrasMock[id?.toUpperCase() ?? ""];

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(amostra?.exames ?? []),
  );

  const formReady = useMemo(
    () => buildInitialState(amostra?.exames ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!amostra) {
    return <AmostraNaoEncontrada id={id ?? ""} />;
  }

  function handleParamChange(
    exameId: number,
    grupoId: string,
    paramId: string,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [exameId]: {
        ...prev[exameId],
        parametros: {
          ...prev[exameId].parametros,
          [grupoId]: {
            ...prev[exameId].parametros[grupoId],
            [paramId]: value,
          },
        },
      },
    }));
  }

  function handleCampoChange(
    exameId: number,
    field: "valorGenerico" | "observacoes",
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [exameId]: { ...prev[exameId], [field]: value },
    }));
  }

  async function salvarResultados() {
    setLoading(true);
    try {
      const resultData: Record<string, unknown> = {};

      for (const exame of amostra.exames) {
        const exameForm = form[exame.id];
        const template = findTemplate(exame.nome);

        if (template) {
          const exameData: Record<string, unknown> = {};
          for (const grupo of template.grupos) {
            exameData[grupo.id] = { ...exameForm.parametros[grupo.id] };
          }
          if (exameForm.observacoes) {
            exameData.observacoes = exameForm.observacoes;
          }
          resultData[exame.nome.toLowerCase()] = exameData;
        } else {
          resultData[exame.nome.toLowerCase()] = {
            resultado: exameForm.valorGenerico,
            observacoes: exameForm.observacoes,
          };
        }
      }

      // TODO: POST /sample-results com { sampleId, resultData }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        "resultData:",
        JSON.stringify({ sampleId: amostra.codigo, resultData }, null, 2),
      );

      toast.success("Resultados cadastrados com sucesso.");
      router.push("/amostras");
    } catch {
      toast.error("Erro ao salvar resultados.");
    } finally {
      setLoading(false);
    }
  }

  if (amostra.status === "Concluído") {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Cadastro de Resultados</h1>
          <p className="text-sm text-muted-foreground">
            Esta amostra já possui resultados cadastrados.
          </p>
        </header>

        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-muted-foreground">
              Nenhuma alteração pode ser realizada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <ClipboardCheck className="size-6" />
          Cadastro de Resultados
        </h1>
        <p className="text-sm text-muted-foreground">
          Registre os resultados dos exames da amostra.
        </p>
      </header>

      {/* Informações da Amostra */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informações da Amostra</CardTitle>
          <CardDescription>Dados gerais da solicitação.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Código da Amostra</p>
            <p className="font-medium">{amostra.codigo}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Protocolo</p>
            <p className="font-mono">{amostra.protocolo}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Pesquisador</p>
            <p>{amostra.pesquisador}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Data do Agendamento</p>
            <p>{amostra.dataAgendamento}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="outline" className={statusClass[amostra.status]}>
              {amostra.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Exames */}
      {amostra.exames.map((exame) => {
        const template = findTemplate(exame.nome);
        const exameForm = form[exame.id];

        return (
          <Card key={exame.id}>
            <CardHeader className="border-b">
              <CardTitle>{exame.nome}</CardTitle>
              <CardDescription>
                Preencha os resultados obtidos na análise.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {template ? (
                <>
                  {template.grupos.map((grupo) => (
                    <GrupoParametros
                      key={grupo.id}
                      grupo={grupo}
                      valores={exameForm.parametros[grupo.id] ?? {}}
                      onChangeParam={(paramId, value) =>
                        handleParamChange(exame.id, grupo.id, paramId, value)
                      }
                    />
                  ))}

                  <div className="space-y-1.5">
                    <Label htmlFor={`obs-${exame.id}`}>
                      Observações{" "}
                      <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Textarea
                      id={`obs-${exame.id}`}
                      placeholder="Ex: Série Vermelha - Normocitose e Normocromia"
                      value={exameForm.observacoes}
                      onChange={(e) =>
                        handleCampoChange(exame.id, "observacoes", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor={`val-${exame.id}`}>Resultado</Label>
                    <Input
                      id={`val-${exame.id}`}
                      placeholder="Digite o resultado"
                      value={exameForm.valorGenerico}
                      onChange={(e) =>
                        handleCampoChange(exame.id, "valorGenerico", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`obs-${exame.id}`}>
                      Observações{" "}
                      <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Input
                      id={`obs-${exame.id}`}
                      placeholder="Observações (opcional)"
                      value={exameForm.observacoes}
                      onChange={(e) =>
                        handleCampoChange(exame.id, "observacoes", e.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/amostras")}>
          Cancelar
        </Button>

        <Button onClick={salvarResultados} disabled={loading}>
          {loading ? "Salvando..." : "Salvar Resultados"}
        </Button>
      </div>
    </div>
  );
}
