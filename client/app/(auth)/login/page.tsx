"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Eye,
  EyeOff,
  FlaskConical,
  Loader2,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Nenhuma conta encontrada com este e-mail.",
  "auth/wrong-password": "Senha incorreta. Tente novamente.",
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/invalid-email": "Endereço de e-mail inválido.",
  "auth/too-many-requests":
    "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
};

const BRAND_FEATURES = [
  "Controle de amostras em tempo real",
  "Histórico completo por pesquisador",
  "Laudos prontos para download",
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setEnviando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const idToken = await userCredential.user.getIdToken();
      document.cookie = `token=${idToken}; path=/; max-age=604800; SameSite=Strict`;
      router.push("/dashboard");
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? "";
      setErro(
        FIREBASE_ERROR_MESSAGES[code] ??
          "Ocorreu um erro inesperado. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left: brand panel ── */}
      <aside className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Ambient glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 size-112 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 size-112 rounded-full bg-accent/15 blur-3xl"
        />
        {/* Dot grid — same pattern used across the app */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[24px_24px] opacity-50"
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-accent to-info text-white shadow-lg shadow-accent/20">
            <FlaskConical className="size-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sidebar-foreground/50">
              LIACLI
            </p>
            <h1 className="text-xl font-semibold leading-tight">
              Gestão de análises clínicas
            </h1>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-6">
          <div className="space-y-4">
            <h2 className="max-w-md text-3xl font-bold leading-tight">
              Tudo sobre seus exames,{" "}
              <span className="bg-linear-to-r from-accent to-info bg-clip-text text-transparent">
                em um só lugar.
              </span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-sidebar-foreground/65">
              Acompanhe protocolos, gerencie amostras e libere resultados com
              segurança e rastreabilidade total.
            </p>
          </div>

          {/* Glass feature list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <ul className="space-y-3.5">
              {BRAND_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-sidebar-foreground/80"
                >
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <span
                      className="size-1.5 rounded-full bg-accent"
                      aria-hidden
                    />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-sidebar-foreground/70 backdrop-blur-sm">
            <ShieldCheck className="size-3.5 text-accent" aria-hidden />
            Sistema homologado para laboratórios clínicos
          </div>
        </div>

        <p className="relative text-xs text-sidebar-foreground/40">
          © {new Date().getFullYear()} LIACLI · Sistema de gestão laboratorial
        </p>
      </aside>

      {/* ── Right: form panel ── */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-12 sm:px-10">
        {/* Subtle background tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-50/60 via-background to-background"
        />
        {/* Ambient blobs — give depth to the glass card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-20 size-96 rounded-full bg-blue-400/12 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-20 size-96 rounded-full bg-accent/10 blur-3xl"
        />

        {/* Glass card */}
        <div className="relative w-full max-w-sm">
          <div className="rounded-2xl border border-blue-100/80 bg-white/75 p-8 shadow-2xl shadow-blue-100/40 backdrop-blur-xl">
            {/* Card header */}
            <header className="mb-8 space-y-4">
              {/* Mobile logo */}
              <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-md shadow-blue-200/60 lg:hidden">
                <FlaskConical className="size-6" aria-hidden />
              </div>

              {/* Security badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
                <ShieldCheck className="size-3" aria-hidden />
                Acesso seguro
              </span>

              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Bem-vindo de volta
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Entre com sua conta administrativa para acessar o painel.
                </p>
              </div>
            </header>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              noValidate
              className="space-y-5"
              aria-describedby={erro ? "login-erro" : undefined}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={enviando}
                  aria-invalid={Boolean(erro) || undefined}
                  className="h-11 border-blue-100 bg-white text-sm transition-colors focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <button
                    type="button"
                    className="rounded text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                    disabled={enviando}
                    aria-invalid={Boolean(erro) || undefined}
                    className="h-11 pr-11 border-blue-100 bg-white text-sm transition-colors focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setMostrarSenha((value) => !value)}
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={mostrarSenha}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </Button>
                </div>
              </div>

              {erro && (
                <Alert
                  variant="destructive"
                  id="login-erro"
                  aria-live="assertive"
                >
                  <AlertTitle>Não foi possível entrar</AlertTitle>
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              {sucesso && (
                <Alert aria-live="polite" className="border-success/40">
                  <AlertTitle className="text-success">Tudo certo!</AlertTitle>
                  <AlertDescription>{sucesso}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={enviando}
                className="h-11 w-full bg-linear-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-900/30"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" aria-hidden />
                    Entrar na plataforma
                  </>
                )}
              </Button>
            </form>

            {/* Footer trust indicator */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
              <ShieldCheck className="size-3.5 text-blue-400" aria-hidden />
              Conexão segura e criptografada
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
