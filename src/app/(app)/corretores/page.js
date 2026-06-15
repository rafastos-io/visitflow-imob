"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export default function CorretoresPage() {
  const [users, setUsers] = useState([]);
  const [dash, setDash] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/users").then(setUsers).catch((e) => setError(e.message));
    api("/dashboard/manager").then(setDash).catch(() => {});
  }, []);

  const statsByBroker = {};
  dash?.media_estrelas_por_corretor?.forEach((b) => { statsByBroker[b.broker_id] = b; });

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Equipe</p>
        <h2 className="font-display text-3xl font-bold text-graphite">Corretores</h2>
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.filter((u) => u.role === "CORRETOR").map((u) => {
          const s = statsByBroker[u.id];
          return (
            <article key={u.id} className="card">
              <p className="font-semibold text-graphite">{u.name}</p>
              <p className="text-sm text-graphite/60">{u.email}</p>
              <div className="mt-3 flex justify-between text-sm">
                <span>Visitas realizadas: <b>{s?.realizadas ?? 0}</b></span>
                <span className="text-orange">★ {s?.avg_score ?? 0}</span>
              </div>
            </article>
          );
        })}
        {users.filter((u) => u.role === "CORRETOR").length === 0 && <p className="text-graphite/50">Nenhum corretor.</p>}
      </div>
    </div>
  );
}
