"use client";

export const STATUS_LABELS = {
  MARCADA: "Marcada",
  CONFIRMADA: "Confirmada",
  REALIZADA: "Realizada",
  CLIENTE_QUENTE: "Cliente Quente",
  PROPOSTA_EM_ANDAMENTO: "Proposta em Andamento",
  CANCELADA: "Cancelada",
};

const STATUS_STYLE = {
  MARCADA: "bg-graphite/10 text-graphite",
  CONFIRMADA: "bg-blue-100 text-blue-700",
  REALIZADA: "bg-green-100 text-green-700",
  CLIENTE_QUENTE: "bg-orange text-white",
  PROPOSTA_EM_ANDAMENTO: "bg-peach text-graphite",
  CANCELADA: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status] || "bg-graphite/10"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function Stars({ score }) {
  if (score === null || score === undefined) {
    return <span className="text-xs text-graphite/50">nao avaliada</span>;
  }
  return (
    <span aria-label={`Nota ${score} de 5`} className="text-sm">
      {"★".repeat(score)}
      <span className="text-graphite/30">{"★".repeat(5 - score)}</span>
    </span>
  );
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
