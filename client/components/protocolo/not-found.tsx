import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NotFound({ protocol }: { protocol: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-8" aria-hidden />
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Protocolo não encontrado
          </h1>
          <p className="text-muted-foreground">
            Não encontramos nenhuma solicitação vinculada ao protocolo{" "}
            <strong className="font-mono text-foreground">
              {protocol.toUpperCase()}
            </strong>
            . Verifique se o código foi digitado corretamente.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
          <p>
            O protocolo é gerado automaticamente no momento do agendamento e
            enviado ao pesquisador. Certifique-se de utilizar exatamente o
            código recebido.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/pesquisador">
              <ArrowLeft className="size-4" aria-hidden />
              Voltar ao portal
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pesquisador/agendamento">Realizar agendamento</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
