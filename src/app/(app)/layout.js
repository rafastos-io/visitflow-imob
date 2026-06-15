"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api-client";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/kanban", label: "Kanban", icon: "🗂️" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/imoveis", label: "Imoveis", icon: "🏠" },
  { href: "/corretores", label: "Corretores", icon: "🧑‍💼", managerOnly: true },
  { href: "/clientes-quentes", label: "Clientes Quentes", icon: "🔥" },
  { href: "/relatorios", label: "Relatorios", icon: "📈" },
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
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 flex-col bg-graphite text-white" aria-label="Menu principal">
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold">
            VisitFlow <span className="text-orange">Imob</span>
          </h1>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-orange text-white" : "text-white/80 hover:bg-white/10"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-sm">
          <p className="font-semibold">{user.name}</p>
          <p className="text-white/60">{user.role === "GERENTE" ? "Gerente" : "Corretor"}</p>
          <button onClick={logout} className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-left hover:bg-white/20">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
