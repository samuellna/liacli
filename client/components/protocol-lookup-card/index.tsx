"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROTOCOL_PATTERN = /^[A-Z0-9]{6}$/;

export function ProtocolLookupCard() {
  const router = useRouter();
  const [protocol, setProtocol] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = protocol.trim().toUpperCase();

    if (!PROTOCOL_PATTERN.test(normalized)) {
      setError("Informe um protocolo válido (6 caracteres, letras e números).");
      return;
    }

    setError(null);
    router.push(`/protocolo/${normalized}`);
  }

  return (
    <article
      id="consulta"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-info/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-center gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-info/10 group-hover:text-info group-hover:ring-info/20">
          <Search className="size-6" aria-hidden />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Acompanhamento
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-foreground">
        Consulta via protocolo
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        Informe o código gerado no momento do agendamento para acompanhar o
        status do exame, etapas concluídas e disponibilidade do laudo.
      </p>

      <form
        onSubmit={handleSubmit}
        className="relative mt-5 space-y-2"
        noValidate
      >
        <Label htmlFor="protocolo" className="text-sm font-medium">
          Código do protocolo
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="protocolo"
            name="protocolo"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Ex.: A1B2C3"
            maxLength={6}
            value={protocol}
            onChange={(event) => {
              setProtocol(event.target.value.toUpperCase());
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "protocolo-erro" : "protocolo-ajuda"}
            className="h-11 text-base tracking-[0.3em] uppercase placeholder:tracking-normal placeholder:normal-case sm:text-base"
          />
          <Button type="submit" size="lg" className="h-11 sm:w-auto">
            Consultar
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
        </div>

        {error ? (
          <p
            id="protocolo-erro"
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        ) : (
          <p id="protocolo-ajuda" className="text-xs text-muted-foreground">
            O protocolo possui 6 caracteres (letras e números) e é enviado após
            o agendamento.
          </p>
        )}
      </form>

      <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-accent" aria-hidden />
        Consulta segura, sem necessidade de login.
      </p>
    </article>
  );
}
