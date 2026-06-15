"use client";

import { useState } from "react";
import Modal from "./Modal";
import { api } from "@/lib/api-client";

const Q = {
  was_completed: ["Sim", "Não", "Parcialmente"],
  visited_count: ["1", "2 a 3", "4 a 5", "Mais de 5"],
  interest_level: ["Não", "Pouco", "Médio", "Alto"],
  general_perception: [
    "Não gostou dos imóveis",
    "Gostou parcialmente",
    "Gostou, mas quer ver novas opções",
    "Gostou muito",
    "Quer fazer proposta",
  ],
};

function Field({ label, options, value, onChange }) {
  return (
    <fieldset className="space-y-1">
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              value === o ? "border-orange bg-orange text-white" : "border-graphite/20 bg-white"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function FeedbackModal({ visit, onClose, onSaved }) {
  const [form, setForm] = useState({
    was_completed: "Sim",
    visited_count: "2 a 3",
    interest_level: "Médio",
    has_proposal_intent: false,
    general_perception: "Gostou parcialmente",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const res = await api(`/visits/${visit.id}/feedback`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onSaved(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Quiz pós-visita · ${visit.client?.name || ""}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="1. A visita foi realizada?" options={Q.was_completed} value={form.was_completed} onChange={(v) => set("was_completed", v)} />
        <Field label="2. Quantos imóveis foram visitados?" options={Q.visited_count} value={form.visited_count} onChange={(v) => set("visited_count", v)} />
        <Field label="3. O cliente demonstrou interesse?" options={Q.interest_level} value={form.interest_level} onChange={(v) => set("interest_level", v)} />

        <fieldset className="space-y-1">
          <legend className="label">4. Algum imóvel gerou possibilidade de proposta?</legend>
          <div className="flex gap-2">
            {[true, false].map((b) => (
              <button
                type="button"
                key={String(b)}
                onClick={() => set("has_proposal_intent", b)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  form.has_proposal_intent === b ? "border-orange bg-orange text-white" : "border-graphite/20 bg-white"
                }`}
              >
                {b ? "Sim" : "Não"}
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="5. Percepção geral do cliente" options={Q.general_perception} value={form.general_perception} onChange={(v) => set("general_perception", v)} />

        <div>
          <label className="label" htmlFor="fb-notes">6. Observações do corretor</label>
          <textarea id="fb-notes" className="input" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Enviando..." : "Enviar e calcular nota"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
