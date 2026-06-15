"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <p className="text-sm text-graphite/70">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent || "text-graphite"}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/manager").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p>Carregando...</p>;

  const t = data.totals;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-graphite">Dashboard</h2>
        <p className="text-graphite/70">Indicadores gerais da operacao</p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" aria-label="Indicadores">
        <StatCard label="Marcadas" value={t.marcadas} />
        <StatCard label="Confirmadas" value={t.confirmadas} />
        <StatCard label="Realizadas" value={t.realizadas} accent="text-green-600" />
        <StatCard label="Canceladas" value={t.canceladas} accent="text-red-600" />
        <StatCard label="Clientes Quentes" value={t.clientesQuentes} accent="text-orange" />
        <StatCard label="Propostas" value={t.propostas} accent="text-orange" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total de visitas" value={data.total_visitas} />
        <StatCard label="Taxa de visita realizada" value={`${data.taxa_realizada}%`} accent="text-green-600" />
        <StatCard label="Corretores ativos" value={data.media_estrelas_por_corretor.length} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h3 className="mb-3 font-semibold text-graphite">Media de estrelas por corretor</h3>
          <ul className="space-y-2">
            {data.media_estrelas_por_corretor.map((b) => (
              <li key={b.broker_id} className="flex items-center justify-between text-sm">
                <span>{b.name}</span>
                <span className="font-semibold text-orange">★ {b.avg_score}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 className="mb-3 font-semibold text-graphite">Imoveis mais visitados</h3>
          <ul className="space-y-2">
            {data.imoveis_mais_visitados.length === 0 && <li className="text-sm text-graphite/60">Sem dados.</li>}
            {data.imoveis_mais_visitados.map((p) => (
              <li key={p.title} className="flex items-center justify-between text-sm">
                <span className="truncate pr-2">{p.title}</span>
                <span className="rounded-full bg-peach px-2 py-0.5 text-xs font-semibold">{p.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
