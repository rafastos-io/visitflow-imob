export const colors = {
  graphite: "#0E3B2E", // esmeralda profundo (ink / acao primaria)
  orange: "#C99A2E", // latao/ouro (acento)
  peach: "#E8D8A8",
  cream: "#ECEFE8", // sage (fundo)
  white: "#FFFFFF",
  red: "#B23A2E",
  green: "#2E7D6B",
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
