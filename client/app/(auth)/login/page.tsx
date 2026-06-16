"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, FlaskConical, Loader2, LogIn } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/firebase";

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Nenhuma conta encontrada com este e-mail.",
  "auth/wrong-password": "Senha incorreta. Tente novamente.",
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/invalid-email": "Endereço de e-mail inválido.",
  "auth/too-many-requests":
    "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
};

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
      localStorage.setItem("token", idToken);
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
      <aside className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-primary/30 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg">
            <FlaskConical className="size-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-sidebar-foreground/70">
              LIACLI
            </p>
            <h1 className="text-2xl font-semibold leading-tight">
              Gestão de análises clínicas
            </h1>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Tudo sobre seus exames, em um só lugar.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-sidebar-foreground/70">
            Acompanhe protocolos, gerencie amostras e libere resultados com
            segurança e rastreabilidade.
          </p>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Controle de amostras em tempo real
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Histórico completo por pesquisador
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Laudos prontos para download
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} LIACLI · Sistema de gestão laboratorial
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8">
          <header className="space-y-2 text-center lg:text-left">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden">
              <FlaskConical className="size-6" aria-hidden />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com sua conta para acessar o painel.
            </p>
          </header>

          <form
            onSubmit={handleLogin}
            noValidate
            className="space-y-4"
            aria-describedby={erro ? "login-erro" : undefined}
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@laboratorio.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={enviando}
                aria-invalid={Boolean(erro) || undefined}
                className="h-11 text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
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
                  className="h-11 pr-11 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMostrarSenha((value) => !value)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
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
              className="h-11 w-full text-sm font-semibold"
            >
              {enviando ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" aria-hidden />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ou continue com
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Google", title: "Login com Google (em breve)" },
                { label: "GitHub", title: "Login com GitHub (em breve)" },
                { label: "Facebook", title: "Login com Facebook (em breve)" },
              ].map((provider) => (
                <Button
                  key={provider.label}
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled
                  title={provider.title}
                  aria-label={provider.title}
                  className="h-11 text-xs font-medium"
                >
                  {provider.label}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <a
              href="#"
              className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Registre-se grátis
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
