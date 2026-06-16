"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  TestTube,
  Activity,
  LogOut,
  FlaskConical,
} from "lucide-react";
import { signOut } from "firebase/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
//import { auth } from "@/lib/firebase";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Solicitações", url: "/solicitacoes", icon: FileText },
  { title: "Amostras", url: "/amostras", icon: TestTube },
  { title: "Resultados", url: "/resultados", icon: Activity },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // const user = auth.currentUser;
  // const displayName = user?.displayName ?? user?.email ?? "Funcionário";
  const user = { displayName: "Funcionário Teste", email: "teste@liacli.com" };
  const displayName = user.displayName;
  const initials = displayName.slice(0, 2).toUpperCase();
  const cargo = "Analista de Laboratório";

  async function handleSignOut() {
    // await signOut(auth);
    router.push("/login");
  }

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FlaskConical className="size-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide text-sidebar-foreground">
              LIACLI
            </h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold tracking-widest">
            PRINCIPAL
          </SidebarGroupLabel>

          <SidebarMenu className="mt-3 space-y-1">
            {mainItems.map((item) => {
              const isActive =
                pathname === item.url || pathname.startsWith(item.url + "/");
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="h-11 rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" aria-hidden />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold tracking-widest">
            ADMINISTRATIVO
          </SidebarGroupLabel>
          <SidebarMenu className="mt-3 space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-11 rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link href="/exames">
                  <FlaskConical />
                  <span className="font-medium">Exames</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-semibold tracking-widest">
            CONTA
          </SidebarGroupLabel>

          <SidebarMenu className="mt-3">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="h-11 rounded-xl text-sidebar-foreground/80 transition-colors duration-150 hover:bg-destructive/15 hover:text-destructive"
                aria-label="Sair da conta"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="font-medium">Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {cargo}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
