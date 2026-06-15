"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api-client";
import { formatDate } from "./ui";

export default function NotificationsBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function load() {
    api("/notifications").then(setItems).catch(() => {});
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  async function markRead(n) {
    if (n.read) return;
    try {
      await api(`/notifications/${n.id}/read`, { method: "PATCH" });
      setItems((arr) => arr.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    } catch {}
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg border border-graphite/20 bg-white px-3 py-2 text-graphite hover:bg-cream"
        aria-label={`Notificações${unread ? `, ${unread} não lidas` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span aria-hidden>🔔</span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-graphite/10 bg-white shadow-xl">
          <div className="border-b border-graphite/10 px-4 py-2 text-sm font-semibold text-graphite">Notificações</div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-graphite/50">Nenhuma notificação.</li>}
            {items.map((n) => (
              <li
                key={n.id}
                onClick={() => markRead(n)}
                className={`cursor-pointer border-b border-graphite/5 px-4 py-3 text-sm hover:bg-cream ${n.read ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-graphite">{n.title}</span>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-orange" aria-label="não lida" />}
                </div>
                <p className="mt-0.5 text-graphite/70">{n.message}</p>
                <p className="mt-1 text-xs text-graphite/40">{formatDate(n.created_at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
