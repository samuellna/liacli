"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type SuccessCardProps = {
  protocol: string;
  name: string;
  onNew: () => void;
};

export function SuccessCard({ protocol, name, onNew }: SuccessCardProps) {
  const firstName = name ? name.split(" ")[0] : "";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-8" aria-hidden />
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Agendamento enviado!
          </h2>
          <p className="text-muted-foreground">
            {firstName ? `Obrigado, ${firstName}. ` : ""}
            Sua solicitação foi registrada com sucesso. Guarde o protocolo
            abaixo para acompanhar o status do agendamento.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-6 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Protocolo
          </p>
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
            {protocol}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href={`/protocolo/${protocol}`}>
              Acompanhar agendamento
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onNew}
          >
            Novo agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}
