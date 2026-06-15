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
  CONFIRMADA: "bg-teal/15 text-teal",
  REALIZADA: "bg-graphite text-white",
  CLIENTE_QUENTE: "bg-orange text-graphite",
  PROPOSTA_EM_ANDAMENTO: "bg-clay/15 text-clay",
  CANCELADA: "bg-signal/10 text-signal",
};

// Cor da "espinha" lateral do card no Kanban (hex para usar em style).
export const STATUS_SPINE = {
  MARCADA: "#7C8B84",
  CONFIRMADA: "#2E7D6B",
  REALIZADA: "#0E3B2E",
  CLIENTE_QUENTE: "#C99A2E",
  PROPOSTA_EM_ANDAMENTO: "#C2603F",
  CANCELADA: "#B23A2E",
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
    return <span className="text-xs text-graphite-soft/70">não avaliada</span>;
  }
  return (
    <span aria-label={`Nota ${score} de 5`} className="text-sm text-orange">
      {"★".repeat(score)}
      <span className="text-graphite/15">{"★".repeat(5 - score)}</span>
    </span>
  );
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
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
