"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function ClientesPage() {
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [error, setError] = useState("");

  function load() {
    api("/clients").then(setClients).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function save() {
    if (!form.name) return setError("Informe o nome.");
    try {
      await api("/clients", { method: "POST", body: JSON.stringify(form) });
      setShow(false);
      setForm({ name: "", phone: "", email: "", notes: "" });
      toast("Cliente cadastrado");
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-graphite">Clientes</h2>
        <button className="btn-primary" onClick={() => setShow(true)}>+ Novo cliente</button>
      </header>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-graphite/70">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Observações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-graphite/10">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.phone || "—"}</td>
                <td className="px-4 py-3">{c.email || "—"}</td>
                <td className="px-4 py-3 text-graphite/70">{c.notes || "—"}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-graphite/50">Nenhum cliente.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title="Novo cliente" onClose={() => setShow(false)}>
          <div className="space-y-3">
            <div><label className="label" htmlFor="c-name">Nome</label><input id="c-name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div><label className="label" htmlFor="c-phone">Telefone</label><input id="c-phone" className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div><label className="label" htmlFor="c-email">E-mail</label><input id="c-email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <div><label className="label" htmlFor="c-notes">Observações</label><textarea id="c-notes" className="input" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></div>
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setShow(false)}>Cancelar</button>
              <button className="btn-primary" onClick={save}>Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
