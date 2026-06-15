"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { StatusBadge, Stars, formatDate } from "@/components/ui";
import NovaVisitaModal from "@/components/NovaVisitaModal";
import FeedbackModal from "@/components/FeedbackModal";

const COLUMNS = [
  { key: "MARCADA", title: "Visitas Marcadas" },
  { key: "CONFIRMADA", title: "Visitas Confirmadas" },
  { key: "REALIZADA", title: "Visitas Realizadas" },
  { key: "CLIENTE_QUENTE", title: "Clientes Quentes" },
  { key: "PROPOSTA_EM_ANDAMENTO", title: "Proposta em Andamento" },
];

function VisitCard({ visit, onAction, onFeedback }) {
  const count = visit.visit_properties?.length || 0;
  return (
    <article className={`card mb-3 ${visit.status === "CLIENTE_QUENTE" ? "border-orange ring-1 ring-orange" : ""}`}>
      {visit.needs_update && (
        <p className="mb-2 rounded bg-orange/15 px-2 py-1 text-xs font-semibold text-orange">⚠ Atualizar visita</p>
      )}
      <p className="font-semibold text-graphite">{visit.client?.name}</p>
      <p className="text-xs text-graphite/60">Corretor: {visit.broker?.name}</p>
      <p className="mt-1 text-xs text-graphite/70">{formatDate(visit.scheduled_at)}</p>
      <p className="text-xs text-graphite/70">Roteiro: {count} {count === 1 ? "imovel" : "imoveis"}</p>
      <div className="mt-2 flex items-center justify-between">
        <StatusBadge status={visit.status} />
        <Stars score={visit.score} />
      </div>
      <div className="mt-3 flex gap-2">
        {visit.status === "MARCADA" && (
          <button className="btn-primary px-3 py-1 text-xs" onClick={() => onAction(visit, "CONFIRMADA")}>Confirmar</button>
        )}
        {(visit.status === "CONFIRMADA" || visit.status === "REALIZADA" || visit.needs_update) && (
          <button className="btn-ghost px-3 py-1 text-xs" onClick={() => onFeedback(visit)}>Responder quiz</button>
        )}
      </div>
    </article>
  );
}

export default function KanbanPage() {
  const [visits, setVisits] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState(null);
  const [error, setError] = useState("");

  function load() {
    api("/visits").then(setVisits).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function changeStatus(visit, status) {
    try {
      await api(`/visits/${visit.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-graphite">Kanban de visitas</h2>
          <p className="text-graphite/70">Acompanhamento visual do fluxo</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNew(true)}>+ Nova visita</button>
      </header>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = visits.filter((v) => v.status === col.key);
          return (
            <section key={col.key} className="w-72 flex-shrink-0">
              <div className="mb-3 flex items-center justify-between rounded-lg bg-graphite px-3 py-2 text-white">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="rounded-full bg-white/20 px-2 text-xs">{items.length}</span>
              </div>
              {items.map((v) => (
                <VisitCard key={v.id} visit={v} onAction={changeStatus} onFeedback={setFeedbackVisit} />
              ))}
              {items.length === 0 && <p className="px-1 text-xs text-graphite/40">Sem visitas.</p>}
            </section>
          );
        })}
      </div>

      {showNew && (
        <NovaVisitaModal
          onClose={() => setShowNew(false)}
          onSaved={() => {
            setShowNew(false);
            load();
          }}
        />
      )}
      {feedbackVisit && (
        <FeedbackModal
          visit={feedbackVisit}
          onClose={() => setFeedbackVisit(null)}
          onSaved={() => {
            setFeedbackVisit(null);
            load();
          }}
        />
      )}
    </div>
  );
}
