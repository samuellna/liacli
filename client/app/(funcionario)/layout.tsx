"use client";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
//import { auth } from "@/lib/firebase";

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

//function UserAvatar() {
// const user = auth.currentUser;
//  const displayName = user?.displayName ?? user?.email ?? "Funcionário";
//  const initials = displayName.slice(0, 2).toUpperCase();

function UserAvatar() {
  // Comentamos a chamada do Firebase temporariamente
  // const user = auth.currentUser;
  
  // Usuário mockado apenas para visualização da interface
  const user = { displayName: "Funcionário Teste", email: "teste@liacli.com" };

  const displayName = user?.displayName ?? user?.email ?? "Funcionário";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
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

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="gap-1.5 text-xs text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/40"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              Sistema online
            </Badge>
            <UserAvatar />
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-6" aria-live="polite">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
