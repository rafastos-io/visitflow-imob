"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

function StatCard({ label, value, dot, suffix }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2">
        {dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} aria-hidden />}
        <p className="text-xs font-medium uppercase tracking-wide text-graphite-soft">{label}</p>
      </div>
      <p className="num mt-2 text-3xl font-bold text-graphite">
        {value}
        {suffix && <span className="ml-0.5 text-lg text-graphite-soft">{suffix}</span>}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/manager").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p role="alert" className="text-signal">{error}</p>;
  if (!data) return <p className="text-graphite-soft">Carregando...</p>;

  const t = data.totals;
  const maxProp = Math.max(1, ...data.imoveis_mais_visitados.map((p) => p.count));

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Operação</p>
        <h2 className="font-display text-3xl font-bold text-graphite">Dashboard</h2>
        <p className="text-graphite-soft">Indicadores gerais da equipe</p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" aria-label="Indicadores">
        <StatCard label="Marcadas" value={t.marcadas} dot="#7C8B84" />
        <StatCard label="Confirmadas" value={t.confirmadas} dot="#2E7D6B" />
        <StatCard label="Realizadas" value={t.realizadas} dot="#0E3B2E" />
        <StatCard label="Canceladas" value={t.canceladas} dot="#B23A2E" />
        <StatCard label="Quentes" value={t.clientesQuentes} dot="#C99A2E" />
        <StatCard label="Propostas" value={t.propostas} dot="#C2603F" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card bg-graphite text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-orange/80">Taxa de visita realizada</p>
          <p className="num mt-2 text-4xl font-bold">{data.taxa_realizada}<span className="text-2xl text-white/60">%</span></p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/15">
            <div className="h-1.5 rounded-full bg-orange" style={{ width: `${data.taxa_realizada}%` }} />
          </div>
        </div>
        <StatCard label="Total de visitas" value={data.total_visitas} />
        <StatCard label="Corretores ativos" value={data.media_estrelas_por_corretor.length} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h3 className="mb-3 font-display text-lg font-bold text-graphite">Média de estrelas por corretor</h3>
          <ul className="space-y-3">
            {data.media_estrelas_por_corretor.map((b) => (
              <li key={b.broker_id} className="flex items-center justify-between text-sm">
                <span className="text-graphite">{b.name}</span>
                <span className="text-orange">
                  {"★".repeat(Math.round(b.avg_score))}
                  <span className="text-graphite/15">{"★".repeat(5 - Math.round(b.avg_score))}</span>
                  <span className="num ml-2 text-graphite-soft">{b.avg_score}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3 className="mb-3 font-display text-lg font-bold text-graphite">Imóveis mais visitados</h3>
          <ul className="space-y-3">
            {data.imoveis_mais_visitados.length === 0 && <li className="text-sm text-graphite-soft">Sem dados.</li>}
            {data.imoveis_mais_visitados.map((p) => (
              <li key={p.title} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate pr-2 text-graphite">{p.title}</span>
                  <span className="num text-graphite-soft">{p.count}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-cream">
                  <div className="h-1.5 rounded-full bg-orange" style={{ width: `${(p.count / maxProp) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
