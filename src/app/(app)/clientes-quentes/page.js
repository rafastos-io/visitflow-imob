"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Stars, StatusBadge, formatDate } from "@/components/ui";

export default function ClientesQuentesPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/hot-clients").then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-graphite">🔥 Clientes Quentes</h2>
        <p className="text-graphite/70">Oportunidades com nota 4 ou 5</p>
      </header>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <article key={v.id} className="card border-orange ring-1 ring-orange/40">
            <p className="font-semibold text-graphite">{v.client?.name}</p>
            <p className="text-xs text-graphite/60">Corretor: {v.broker?.name}</p>
            <p className="text-xs text-graphite/60">{v.client?.phone}</p>
            <p className="mt-1 text-xs text-graphite/70">{formatDate(v.scheduled_at)}</p>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge status={v.status} />
              <Stars score={v.score} />
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-graphite/50">Nenhum cliente quente ainda.</p>}
      </div>
    </div>
  );
}
