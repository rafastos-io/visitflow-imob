"use client";

import { useEffect, useState } from "react";
import { api, getStoredUser } from "@/lib/api-client";
import { StatusBadge, Stars, formatDate } from "@/components/ui";
import { useToast } from "@/components/Toast";
import NovaVisitaModal from "@/components/NovaVisitaModal";
import FeedbackModal from "@/components/FeedbackModal";
import VisitDetailModal from "@/components/VisitDetailModal";

const COLUMNS = [
  { key: "MARCADA", title: "Visitas Marcadas" },
  { key: "CONFIRMADA", title: "Visitas Confirmadas" },
  { key: "REALIZADA", title: "Visitas Realizadas" },
  { key: "CLIENTE_QUENTE", title: "Clientes Quentes" },
  { key: "PROPOSTA_EM_ANDAMENTO", title: "Proposta em Andamento" },
];

function VisitCard({ visit, onOpen, onConfirm, onFeedback }) {
  const count = visit.visit_properties?.length || 0;
  return (
    <article
      onClick={() => onOpen(visit)}
      className={`card mb-3 cursor-pointer transition hover:shadow-md ${
        visit.status === "CLIENTE_QUENTE" ? "border-orange ring-1 ring-orange" : ""
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(visit)}
    >
      {visit.needs_update && (
        <p className="mb-2 rounded bg-orange/15 px-2 py-1 text-xs font-semibold text-orange">⚠ Atualizar visita</p>
      )}
      <p className="font-semibold text-graphite">{visit.client?.name}</p>
      <p className="text-xs text-graphite/60">Corretor: {visit.broker?.name}</p>
      <p className="mt-1 text-xs text-graphite/70">{formatDate(visit.scheduled_at)}</p>
      <p className="text-xs text-graphite/70">Roteiro: {count} {count === 1 ? "imóvel" : "imóveis"}</p>
      <div className="mt-2 flex items-center justify-between">
        <StatusBadge status={visit.status} />
        <Stars score={visit.score} />
      </div>
      <div className="mt-3 flex gap-2">
        {visit.status === "MARCADA" && (
          <button
            className="btn-primary px-3 py-1 text-xs"
            onClick={(e) => { e.stopPropagation(); onConfirm(visit); }}
          >
            Confirmar
          </button>
        )}
        {(visit.status === "CONFIRMADA" || visit.status === "REALIZADA" || visit.needs_update) && (
          <button
            className="btn-ghost px-3 py-1 text-xs"
            onClick={(e) => { e.stopPropagation(); onFeedback(visit); }}
          >
            Responder quiz
          </button>
        )}
      </div>
    </article>
  );
}

export default function KanbanPage() {
  const user = getStoredUser();
  const toast = useToast();
  const [visits, setVisits] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [search, setSearch] = useState("");
  const [brokerFilter, setBrokerFilter] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState(null);
  const [detailVisit, setDetailVisit] = useState(null);

  function load() {
    api("/visits").then(setVisits).catch((e) => toast(e.message, "error"));
  }
  useEffect(() => {
    load();
    if (user?.role === "GERENTE") {
      api("/users").then((u) => setBrokers(u.filter((x) => x.role === "CORRETOR"))).catch(() => {});
    }
  }, []);

  async function confirmVisit(visit) {
    try {
      await api(`/visits/${visit.id}/status`, { method: "PATCH", body: JSON.stringify({ status: "CONFIRMADA" }) });
      toast("Visita confirmada");
      load();
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const filtered = visits.filter(
    (v) =>
      (!brokerFilter || v.broker_id === brokerFilter) &&
      (!search || v.client?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-graphite">Kanban de visitas</h2>
          <p className="text-graphite/70">Acompanhamento visual do fluxo</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNew(true)}>+ Nova visita</button>
      </header>

      <div className="flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar por cliente"
        />
        {user?.role === "GERENTE" && (
          <select className="input max-w-xs" value={brokerFilter} onChange={(e) => setBrokerFilter(e.target.value)} aria-label="Filtrar por corretor">
            <option value="">Todos os corretores</option>
            {brokers.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = filtered.filter((v) => v.status === col.key);
          return (
            <section key={col.key} className="w-72 flex-shrink-0">
              <div className="mb-3 flex items-center justify-between rounded-lg bg-graphite px-3 py-2 text-white">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="rounded-full bg-white/20 px-2 text-xs">{items.length}</span>
              </div>
              {items.map((v) => (
                <VisitCard key={v.id} visit={v} onOpen={setDetailVisit} onConfirm={confirmVisit} onFeedback={setFeedbackVisit} />
              ))}
              {items.length === 0 && <p className="px-1 text-xs text-graphite/40">Sem visitas.</p>}
            </section>
          );
        })}
      </div>

      {showNew && (
        <NovaVisitaModal
          onClose={() => setShowNew(false)}
          onSaved={() => { setShowNew(false); toast("Visita criada"); load(); }}
        />
      )}
      {feedbackVisit && (
        <FeedbackModal
          visit={feedbackVisit}
          onClose={() => setFeedbackVisit(null)}
          onSaved={(res) => {
            setFeedbackVisit(null);
            toast(`Visita avaliada: nota ${res.score}`);
            load();
          }}
        />
      )}
      {detailVisit && (
        <VisitDetailModal
          visit={detailVisit}
          onClose={() => setDetailVisit(null)}
          onChanged={() => { setDetailVisit(null); load(); }}
          onQuiz={(v) => { setDetailVisit(null); setFeedbackVisit(v); }}
        />
      )}
    </div>
  );
}
