"use client";

import { useState } from "react";
import Modal from "./Modal";
import { api } from "@/lib/api-client";
import { useToast } from "./Toast";
import { StatusBadge, Stars, formatDate, formatMoney } from "./ui";

export default function VisitDetailModal({ visit, onClose, onChanged, onQuiz }) {
  const toast = useToast();
  const [reschedule, setReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [busy, setBusy] = useState(false);

  const props = (visit.visit_properties || []).slice().sort((a, b) => (a.visit_order || 0) - (b.visit_order || 0));

  async function setStatus(status, msg) {
    setBusy(true);
    try {
      await api(`/visits/${visit.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast(msg);
      onChanged();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function saveReschedule() {
    if (!newDate) return;
    setBusy(true);
    try {
      await api(`/visits/${visit.id}`, { method: "PATCH", body: JSON.stringify({ scheduled_at: newDate }) });
      toast("Visita reagendada");
      onChanged();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Detalhe da visita" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-graphite">{visit.client?.name}</h4>
            <Stars score={visit.score} />
          </div>
          <p className="text-sm text-graphite/70">📞 {visit.client?.phone || "—"}</p>
          {visit.client?.email && <p className="text-sm text-graphite/70">✉ {visit.client.email}</p>}
          <p className="mt-1 text-sm text-graphite/70">Corretor: {visit.broker?.name}</p>
          <p className="text-sm text-graphite/70">🗓 {formatDate(visit.scheduled_at)}</p>
          <div className="mt-2"><StatusBadge status={visit.status} /></div>
          {visit.needs_update && (
            <p className="mt-2 rounded bg-orange/15 px-2 py-1 text-xs font-semibold text-orange">
              ⚠ Esta visita já passou da data. Atualize o status e responda o quiz.
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-graphite">Roteiro de imóveis ({props.length})</p>
          <div className="space-y-2">
            {props.length === 0 && <p className="text-sm text-graphite/50">Nenhum imóvel no roteiro.</p>}
            {props.map((vp) => (
              <div key={vp.property?.id} className="rounded-lg border border-graphite/10 p-2 text-sm">
                <p className="font-medium text-graphite">{vp.visit_order}. {vp.property?.title}</p>
                <p className="text-xs text-graphite/60">
                  {vp.property?.neighborhood} · {vp.property?.city} · {formatMoney(vp.property?.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {visit.notes && (
          <div className="rounded-lg bg-cream p-2 text-sm text-graphite/80">
            <span className="font-semibold">Observações:</span> {visit.notes}
          </div>
        )}

        {reschedule ? (
          <div className="rounded-lg border border-graphite/10 p-3">
            <label className="label" htmlFor="resched">Nova data e horário</label>
            <input id="resched" type="datetime-local" className="input" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <div className="mt-2 flex justify-end gap-2">
              <button className="btn-ghost px-3 py-1 text-sm" onClick={() => setReschedule(false)}>Voltar</button>
              <button className="btn-primary px-3 py-1 text-sm" onClick={saveReschedule} disabled={busy}>Salvar</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 border-t border-graphite/10 pt-3">
            {visit.status === "MARCADA" && (
              <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => setStatus("CONFIRMADA", "Visita confirmada")} disabled={busy}>
                Confirmar
              </button>
            )}
            {(visit.status === "CONFIRMADA" || visit.status === "REALIZADA" || visit.needs_update) && (
              <button className="btn-primary px-3 py-1.5 text-sm" onClick={() => onQuiz(visit)} disabled={busy}>
                Responder quiz
              </button>
            )}
            {["MARCADA", "CONFIRMADA"].includes(visit.status) && (
              <>
                <button className="btn-ghost px-3 py-1.5 text-sm" onClick={() => { setReschedule(true); }} disabled={busy}>
                  Reagendar
                </button>
                <button
                  className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  onClick={() => setStatus("CANCELADA", "Visita cancelada")}
                  disabled={busy}
                >
                  Cancelar visita
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
