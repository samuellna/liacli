"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PROTOCOL_PATTERN = /^[A-Z0-9]{7}$/;

export function ProtocolLookupCard() {
  const router = useRouter();
  const [protocol, setProtocol] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = protocol.trim().toUpperCase();

    if (!PROTOCOL_PATTERN.test(normalized)) {
      setError("Informe um protocolo válido (7 caracteres, letras e números).");
      return;
    }

    setError(null);
    router.push(`/protocolo/${normalized}`);
  }

  return (
    <article
      id="consulta"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-100/60"
    >
      {/* Corner glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-blue-400/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Icon + eyebrow */}
      <div className="relative flex items-center gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200/60">
          <Search className="size-6" aria-hidden />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-500/70">
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
        <Label htmlFor="protocolo" className="text-sm text-muted-foreground">
          Código do protocolo
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="protocolo"
            name="protocolo"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Ex.: A1B2C3D"
            maxLength={7}
            value={protocol}
            onChange={(event) => {
              setProtocol(event.target.value.toUpperCase());
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "protocolo-erro" : "protocolo-ajuda"}
            className="h-11 border-blue-300 bg-white/8 text-base tracking-[0.3em] text-muted-foreground uppercase placeholder:tracking-normal placeholder:normal-case placeholder:text-slate-500 focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20 sm:text-base"
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/40 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-800/50 sm:w-auto"
          >
            Consultar
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Button>
        </div>

        {error ? (
          <p id="protocolo-erro" role="alert" className="text-xs text-red-400">
            {error}
          </p>
        ) : (
          <p id="protocolo-ajuda" className="text-xs text-slate-500">
            O protocolo possui 7 caracteres (letras e números) e é enviado após
            o agendamento.
          </p>
        )}
      </form>

      <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="size-3.5 text-blue-400" aria-hidden />
        Consulta segura, sem necessidade de login.
      </p>
    </article>
  );
}
