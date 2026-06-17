"use client";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/solicitacoes": "Solicitações",
  "/amostras": "Amostras",
  "/resultados": "Resultados",
  "/laudos": "Laudos",
};

function BreadcrumbDinamico() {
  const pathname = usePathname();
  const label = routeLabels[pathname] ?? "LIACLI";

  return (
    <nav aria-label="Navegação atual">
      <p className="text-sm font-medium text-foreground">{label}</p>
    </nav>
  );
}

export default function FuncionarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6 gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />
            <BreadcrumbDinamico />
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-6" aria-live="polite">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
