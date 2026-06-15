"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Modal from "@/components/Modal";
import { formatMoney } from "@/components/ui";
import { useToast } from "@/components/Toast";

const EMPTY = { title: "", neighborhood: "", city: "", type: "", area: "", bedrooms: "", suites: "", parking_spaces: "", price: "", address: "" };

export default function ImoveisPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function load() {
    api("/properties").then(setItems).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function save() {
    if (!form.title) return setError("Informe o título.");
    const numeric = (v) => (v === "" ? null : Number(v));
    try {
      await api("/properties", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          area: numeric(form.area),
          bedrooms: numeric(form.bedrooms),
          suites: numeric(form.suites),
          parking_spaces: numeric(form.parking_spaces),
          price: numeric(form.price),
        }),
      });
      setShow(false);
      setForm(EMPTY);
      toast("Imóvel cadastrado");
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const filtered = items.filter((p) =>
    [p.title, p.neighborhood, p.type, p.city].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Portfólio</p>
          <h2 className="font-display text-3xl font-bold text-graphite">Imóveis</h2>
        </div>
        <button className="btn-gold" onClick={() => setShow(true)}>+ Cadastrar imóvel</button>
      </header>

      <input className="input max-w-sm" placeholder="Buscar por bairro, tipo ou cidade..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar imoveis" />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-graphite/70">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Bairro</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Dorm.</th>
              <th className="px-4 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-graphite/10">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.neighborhood || "—"}</td>
                <td className="px-4 py-3">{p.type || "—"}</td>
                <td className="px-4 py-3">{p.area ? `${p.area} m²` : "—"}</td>
                <td className="px-4 py-3">{p.bedrooms ?? "—"}</td>
                <td className="px-4 py-3">{formatMoney(p.price)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-graphite/50">Nenhum imóvel.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal title="Cadastrar imóvel" onClose={() => setShow(false)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label" htmlFor="p-title">Título</label><input id="p-title" className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
            <div className="col-span-2"><label className="label" htmlFor="p-addr">Endereço</label><input id="p-addr" className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-bairro">Bairro</label><input id="p-bairro" className="input" value={form.neighborhood} onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-city">Cidade</label><input id="p-city" className="input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-type">Tipo</label><input id="p-type" className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-area">Área (m²)</label><input id="p-area" type="number" className="input" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-bed">Dormitórios</label><input id="p-bed" type="number" className="input" value={form.bedrooms} onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-suite">Suítes</label><input id="p-suite" type="number" className="input" value={form.suites} onChange={(e) => setForm((f) => ({ ...f, suites: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-vagas">Vagas</label><input id="p-vagas" type="number" className="input" value={form.parking_spaces} onChange={(e) => setForm((f) => ({ ...f, parking_spaces: e.target.value }))} /></div>
            <div><label className="label" htmlFor="p-price">Valor (R$)</label><input id="p-price" type="number" className="input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setShow(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
