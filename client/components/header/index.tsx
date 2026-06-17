import Link from "next/link";
import { FlaskConical, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface SiteHeaderProps {
  profile?: "Pesquisador" | "Paciente";
}

export function SiteHeader({ profile }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="LIACLI — página inicial"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FlaskConical className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-wide">LIACLI</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 md:flex"
        >
          <Button asChild variant="ghost" size="sm">
            <a href="#servicos">Serviços</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="#confianca">Sobre</a>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {profile && (
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              <Sparkles className="size-3" aria-hidden />
              Perfil: {profile}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
