"use client";

import {
  LayoutDashboard,
  FileText,
  TestTube,
  Activity,
  Download,
  LogOut,
} from "lucide-react";

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
import { useState } from "react";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Solicitações",
    url: "/solicitacoes",
    icon: FileText,
  },
  {
    title: "Amostras",
    url: "/amostras",
    icon: TestTube,
  },
  {
    title: "Resultados",
    url: "/resultados",
    icon: Activity,
  },
  {
    title: "Laudos",
    url: "/laudos",
    icon: Download,
  },
];

export function AppSidebar() {
  const [isActive, setIsActive] = useState<string>("Dashboard");
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400">
            <span className="text-xl font-black text-[#071F4E]">LI</span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wide">LIACLI</h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">
            PRINCIPAL
          </SidebarGroupLabel>

          <SidebarMenu className="mt-3 space-y-1">
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="
                    h-12 rounded-xl
                    text-slate-200
                    hover:bg-sidebar-accent
                    hover:text-white
                    data-[active=true]:bg-sidebar-primary
                    data-[active=true]:text-white
                  "
                  onClick={() => {
                    setIsActive(item.title);
                    console.log(isActive);
                  }}
                  isActive={isActive === item.title}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-slate-400">
            CONTA
          </SidebarGroupLabel>

          <SidebarMenu className="mt-3">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-12 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white">
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 font-bold">
            RO
          </div>

          <div>
            <p className="font-medium">Nome do Funcionário</p>
            <p className="text-sm text-slate-300">Cargo na Clínica</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
