"use client";

import { useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type SolicitacaoResumo = {
  id: number;
  protocolo: string;
  pesquisador: string;
};

export function ModalAtualizar({
  solicitacao,
  open,
  onOpenChange,
  onConfirmar,
}: {
  solicitacao: SolicitacaoResumo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (
    id: number,
    aprovado: boolean,
    observacao: string,
  ) => Promise<void>;
}) {
  const [decisao, setDecisao] = useState<"APROVAR" | "REPROVAR" | null>(null);
  const [observacao, setObservacao] = useState("");
  const [isPending, setIsPending] = useState(false);

  function handleClose(value: boolean) {
    if (!value && !isPending) {
      setDecisao(null);
      setObservacao("");
    }
    onOpenChange(value);
  }

  async function handleConfirmar() {
    if (!solicitacao || decisao === null) return;
    setIsPending(true);
    try {
      await onConfirmar(solicitacao.id, decisao === "APROVAR", observacao);
      setDecisao(null);
      setObservacao("");
    } catch {
      // erro já tratado com toast em onConfirmar
    } finally {
      setIsPending(false);
    }
  }

  if (!solicitacao) return null;

  const podeConfirmar = decisao !== null && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {/* Header com gradiente */}
        <div className="border-b bg-linear-to-br from-primary/8 via-primary/5 to-accent/5 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight">
              Avaliar Solicitação
            </DialogTitle>
            <DialogDescription className="mt-0.5">
              <span className="font-mono font-bold text-foreground">
                {solicitacao.protocolo}
              </span>{" "}
              — {solicitacao.pesquisador}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2.5">
            <Label className="text-sm font-bold text-foreground">Decisão</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecisao("APROVAR")}
                disabled={isPending}
                className={[
                  "group flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                  decisao === "APROVAR"
                    ? "border-success bg-success/10 text-success shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-success/50 hover:bg-success/5 hover:text-success",
                ].join(" ")}
              >
                <CheckCircle
                  className={[
                    "size-7 transition-transform duration-200",
                    decisao === "APROVAR"
                      ? "scale-110"
                      : "group-hover:scale-105",
                  ].join(" ")}
                  aria-hidden
                />
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => setDecisao("REPROVAR")}
                disabled={isPending}
                className={[
                  "group flex flex-col items-center gap-2.5 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                  decisao === "REPROVAR"
                    ? "border-destructive bg-destructive/10 text-destructive shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive",
                ].join(" ")}
              >
                <XCircle
                  className={[
                    "size-7 transition-transform duration-200",
                    decisao === "REPROVAR"
                      ? "scale-110"
                      : "group-hover:scale-105",
                  ].join(" ")}
                  aria-hidden
                />
                Reprovar
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="observacao"
              className="text-sm font-bold text-foreground"
            >
              Observação / Justificativa
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="observacao"
              placeholder="Adicione uma observação ou justificativa para a decisão..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={isPending}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t bg-muted/20 px-6 py-4">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirmar}
              disabled={!podeConfirmar}
              className={
                decisao === "REPROVAR"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : decisao === "APROVAR"
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : ""
              }
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Processando...
                </>
              ) : decisao === "APROVAR" ? (
                <>
                  <CheckCircle className="size-4" aria-hidden />
                  Confirmar aprovação
                </>
              ) : decisao === "REPROVAR" ? (
                <>
                  <XCircle className="size-4" aria-hidden />
                  Confirmar reprovação
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
