"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { StatusBadge, Stars, formatDate } from "@/components/ui";

export default function RelatoriosPage() {
  const [visits, setVisits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [brokerFilter, setBrokerFilter] = useState("");
  const [brokers, setBrokers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/visits").then(setVisits).catch((e) => setError(e.message));
    api("/users").then((u) => setBrokers(u.filter((x) => x.role === "CORRETOR"))).catch(() => {});
  }, []);

  const filtered = visits.filter(
    (v) => (!statusFilter || v.status === statusFilter) && (!brokerFilter || v.broker_id === brokerFilter)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-graphite">Relatórios</h2>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          {["MARCADA", "CONFIRMADA", "REALIZADA", "CLIENTE_QUENTE", "PROPOSTA_EM_ANDAMENTO", "CANCELADA"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="input max-w-xs" value={brokerFilter} onChange={(e) => setBrokerFilter(e.target.value)} aria-label="Filtrar por corretor">
          <option value="">Todos os corretores</option>
          {brokers.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-graphite/70">{filtered.length} visita(s) encontrada(s)</p>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-graphite/70">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Corretor</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Imóveis</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-t border-graphite/10">
                <td className="px-4 py-3 font-medium">{v.client?.name}</td>
                <td className="px-4 py-3">{v.broker?.name}</td>
                <td className="px-4 py-3">{formatDate(v.scheduled_at)}</td>
                <td className="px-4 py-3">{v.visit_properties?.length || 0}</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3"><Stars score={v.score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
