"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b bg-white px-6">
          <SidebarTrigger />
        </header>

        <main className="flex-1 bg-slate-50 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
