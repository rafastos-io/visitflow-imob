export const colors = {
  graphite: "#5D5D5A",
  orange: "#FEA45C",
  peach: "#FFCCAA",
  cream: "#FEF9F0",
  white: "#FFFFFF",
  red: "#D9534F",
  green: "#4CAF50",
};

export const STATUS_LABELS = {
  MARCADA: "Marcada",
  CONFIRMADA: "Confirmada",
  REALIZADA: "Realizada",
  CLIENTE_QUENTE: "Cliente Quente",
  PROPOSTA_EM_ANDAMENTO: "Proposta em Andamento",
  CANCELADA: "Cancelada",
};

export function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function stars(score) {
  if (score === null || score === undefined) return "Não avaliada";
  return "★".repeat(score) + "☆".repeat(5 - score);
}
