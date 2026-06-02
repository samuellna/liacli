"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
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

// mock de amostra

const amostraMock = {
  codigo: "AM001",
  protocolo: "A1B2C3",
  pesquisador: "João Silva",
  dataAgendamento: "20/05/2026",
  status: "Em análise",
  exames: [
    {
      id: 1,
      nome: "Glicemia",
    },
    {
      id: 2,
      nome: "Hemograma",
    },
  ],
};

const statusClass = {
  Pendente:
    "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  "Em análise":
    "border-info/40 bg-info/15 text-info dark:text-info",
  Concluído:
    "border-success/40 bg-success/15 text-success dark:text-success",
};

export default function CadastroResultadoPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [resultados, setResultados] = useState({
    1: {
      valor: "",
      observacoes: "",
    },
    2: {
      valor: "",
      observacoes: "",
    },
  });

  async function salvarResultados() {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Resultados cadastrados com sucesso.");

      router.push("/funcionario/amostras");
    } catch {
      toast.error("Erro ao salvar resultados.");
    } finally {
      setLoading(false);
    }
  }

  if (amostraMock.status === "Concluído") {
    return (
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">
            Cadastro de Resultados
          </h1>

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

      {/* infos da amostra */}

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informações da Amostra</CardTitle>

          <CardDescription>
            Dados gerais da solicitação.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Código da Amostra
            </p>

            <p className="font-medium">
              {amostraMock.codigo}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Protocolo
            </p>

            <p className="font-mono">
              {amostraMock.protocolo}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pesquisador
            </p>

            <p>{amostraMock.pesquisador}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Data do Agendamento
            </p>

            <p>{amostraMock.dataAgendamento}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <Badge
              variant="outline"
              className={
                statusClass[
                  amostraMock.status as keyof typeof statusClass
                ]
              }
            >
              {amostraMock.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* exames */}

      {amostraMock.exames.map((exame) => (
        <Card key={exame.id}>
          <CardHeader className="border-b">
            <CardTitle>{exame.nome}</CardTitle>

            <CardDescription>
              Preencha os resultados obtidos na análise.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1.5">
              <Label>Resultado</Label>

              <Input
                placeholder="Digite o resultado"
                value={resultados[exame.id as 1 | 2].valor}
                onChange={(e) =>
                  setResultados((prev) => ({
                    ...prev,
                    [exame.id]: {
                      ...prev[exame.id as 1 | 2],
                      valor: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Observações</Label>

              <Input
                placeholder="Observações (opcional)"
                value={resultados[exame.id as 1 | 2].observacoes}
                onChange={(e) =>
                  setResultados((prev) => ({
                    ...prev,
                    [exame.id]: {
                      ...prev[exame.id as 1 | 2],
                      observacoes: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* açoes */}

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/funcionario/amostras")}
        >
          Cancelar
        </Button>

        <Button
          onClick={salvarResultados}
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Resultados"}
        </Button>
      </div>
    </div>
  );
}