"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  LayoutDashboard,
  FileText,
  TestTube,
  Activity,
  LogOut,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { cn } from "@/lib/utils";
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
import { auth } from "@/lib/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavEntry {
  title: string;
  url: string;
  icon: LucideIcon;
}

// ── Nav data ──────────────────────────────────────────────────────────────────

const mainItems: NavEntry[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Solicitações", url: "/solicitacoes", icon: FileText },
  { title: "Amostras", url: "/amostras", icon: TestTube },
  { title: "Resultados", url: "/resultados", icon: Activity },
];

const adminItems: NavEntry[] = [
  { title: "Exames", url: "/exames", icon: FlaskConical },
];

// ── Design tokens ─────────────────────────────────────────────────────────────

const TEAL = "oklch(0.72 0.13 195)";
const TEAL_GRADIENT =
  "linear-gradient(135deg, oklch(0.68 0.13 195) 0%, oklch(0.52 0.11 210) 100%)";

// ── NavButton ─────────────────────────────────────────────────────────────────

function NavButton({ item, isActive }: { item: NavEntry; isActive: boolean }) {
  return (
    <div className="relative">
      {isActive && (
        <span
          className="pointer-events-none absolute left-0 top-1/2 h-4.5 w-0.75 -translate-y-1/2 rounded-r-full"
          style={{ background: TEAL }}
          aria-hidden
        />
      )}
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "group h-10 rounded-xl px-3 text-sm font-medium transition-all duration-150",
          "data-[active=true]:bg-white/10 data-[active=true]:text-white",
          !isActive && "text-white/50 hover:bg-white/6 hover:text-white/85",
        )}
      >
        <Link href={item.url}>
          <item.icon
            className={cn(
              "size-4 shrink-0 transition-colors duration-150",
              isActive ? "" : "text-white/35 group-hover:text-white/65",
            )}
            style={isActive ? { color: TEAL } : undefined}
            aria-hidden
          />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </div>
  );
}

// ── NavSection ────────────────────────────────────────────────────────────────

function NavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavEntry[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-1.5 px-2 text-[9.5px] font-bold uppercase tracking-[0.15em] text-white/25">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-px">
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + "/");
          return (
            <SidebarMenuItem key={item.title}>
              <NavButton item={item} isActive={isActive} />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// ── SidebarDivider ────────────────────────────────────────────────────────────

function SidebarDivider() {
  return (
    <div
      className="mx-3 my-3.5 h-px"
      style={{ background: "rgba(255,255,255,0.05)" }}
      aria-hidden
    />
  );
}

// ── AppSidebar ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const displayName = user?.displayName ?? user?.email ?? "Funcionário";
  const initials = displayName.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    await signOut(auth);
    document.cookie = "token=; path=/; max-age=0";
    redirect("/");
  }

  return (
    <Sidebar
      className="border-r border-white/5"
      style={{
        background:
          "linear-gradient(175deg, oklch(0.235 0.07 262) 0%, oklch(0.195 0.055 265) 60%, oklch(0.168 0.042 268) 100%)",
      }}
    >
      {/* ── Logo / Brand ── */}
      <SidebarHeader
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: TEAL_GRADIENT,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.10), 0 4px 14px oklch(0.62 0.11 195 / 0.30), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <FlaskConical className="size-4 text-white" aria-hidden />
          </div>
          <div className="min-w-0">
            <span className="block text-[15px] font-black tracking-[0.13em] text-white/95">
              LIACLI
            </span>
            <span className="block text-[10px] font-medium tracking-wide text-white/30">
              Gestão Laboratorial
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-3 py-4">
        <NavSection label="Principal" items={mainItems} pathname={pathname} />

        <SidebarDivider />

        <NavSection
          label="Administrativo"
          items={adminItems}
          pathname={pathname}
        />

        <SidebarDivider />

        {/* ── Account ── */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1.5 px-2 text-[9.5px] font-bold uppercase tracking-[0.15em] text-white/25">
            Conta
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="h-10 rounded-xl px-3 text-sm font-medium text-white/45 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400 data-[active=true]:bg-transparent data-[active=true]:text-white/45"
                aria-label="Sair da conta"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User card ── */}
      <SidebarFooter
        className="p-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              background: TEAL_GRADIENT,
              boxShadow: "0 0 0 2px rgba(255,255,255,0.07)",
            }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-snug text-white/90">
              {displayName}
            </p>
            {user?.email && (
              <p className="truncate text-[11px] leading-tight text-white/35">
                {user.email}
              </p>
            )}
          </div>
          <span
            className="block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 5px oklch(0.79 0.19 160 / 0.6)" }}
            title="Online"
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
