"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api-client";
import { ToastProvider } from "@/components/Toast";
import NotificationsBell from "@/components/NotificationsBell";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/kanban", label: "Kanban", icon: "🗂️" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/imoveis", label: "Imóveis", icon: "🏠" },
  { href: "/corretores", label: "Corretores", icon: "🧑‍💼", managerOnly: true },
  { href: "/clientes-quentes", label: "Clientes Quentes", icon: "🔥" },
  { href: "/relatorios", label: "Relatórios", icon: "📈" },
];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      window.location.href = "/login";
      return;
    }
    setUser(u);
  }, []);

  if (!user) return null;

  const nav = NAV.filter((item) => !item.managerOnly || user.role === "GERENTE");

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 flex-col bg-graphite text-white blueprint-strong" aria-label="Menu principal">
        <div className="px-5 py-6">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-white">
            VisitFlow<span className="text-orange">.</span>
          </h1>
          <p className="eyebrow mt-1 text-white/40">Gestão de visitas</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-orange text-graphite shadow-card" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span aria-hidden className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl bg-white/5 p-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange font-display font-bold text-graphite" aria-hidden>
              {user.name?.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{user.name}</p>
              <p className="text-xs text-orange/80">{user.role === "GERENTE" ? "Gerente" : "Corretor"}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-white/90 transition hover:bg-white/20">
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-x-auto">
        <header className="flex items-center justify-between gap-3 border-b border-graphite/10 bg-cream/80 px-6 py-3 backdrop-blur">
          <p className="eyebrow hidden sm:block">Gestão de visitas imobiliárias</p>
          <NotificationsBell />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
