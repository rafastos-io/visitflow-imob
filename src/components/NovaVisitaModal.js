"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { api, getStoredUser } from "@/lib/api-client";
import { formatMoney } from "./ui";

export default function NovaVisitaModal({ onClose, onSaved }) {
  const user = getStoredUser();
  const [clients, setClients] = useState([]);
  const [properties, setProperties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [form, setForm] = useState({
    client_id: "",
    broker_id: "",
    scheduled_at: "",
    notes: "",
    property_ids: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/clients").then(setClients).catch(() => {});
    api("/properties").then(setProperties).catch(() => {});
    if (user?.role === "GERENTE") api("/users").then((u) => setBrokers(u.filter((x) => x.role === "CORRETOR"))).catch(() => {});
  }, []);

  function toggleProp(id) {
    setForm((f) => ({
      ...f,
      property_ids: f.property_ids.includes(id)
        ? f.property_ids.filter((p) => p !== id)
        : [...f.property_ids, id],
    }));
  }

  async function submit() {
    if (!form.client_id || !form.scheduled_at) {
      setError("Selecione cliente e data.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.broker_id) delete payload.broker_id;
      const visit = await api("/visits", { method: "POST", body: JSON.stringify(payload) });
      onSaved(visit);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nova visita" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="nv-client">Cliente</label>
          <select id="nv-client" className="input" value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}>
            <option value="">Selecione...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {user?.role === "GERENTE" && (
          <div>
            <label className="label" htmlFor="nv-broker">Corretor</label>
            <select id="nv-broker" className="input" value={form.broker_id} onChange={(e) => setForm((f) => ({ ...f, broker_id: e.target.value }))}>
              <option value="">Eu mesmo</option>
              {brokers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label" htmlFor="nv-date">Data e horario</label>
          <input id="nv-date" type="datetime-local" className="input" value={form.scheduled_at} onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))} />
        </div>

        <div>
          <span className="label">Roteiro de imoveis ({form.property_ids.length})</span>
          <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-graphite/10 p-2">
            {properties.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm hover:bg-cream">
                <input type="checkbox" checked={form.property_ids.includes(p.id)} onChange={() => toggleProp(p.id)} />
                <span className="flex-1 truncate">{p.title}</span>
                <span className="text-xs text-graphite/60">{formatMoney(p.price)}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Salvando..." : "Criar visita"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
