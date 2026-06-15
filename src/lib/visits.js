// Select padrao de uma visita com cliente, corretor e roteiro de imoveis.
export const VISIT_SELECT = `
  *,
  client:clients(id,name,phone,email),
  broker:users!visits_broker_id_fkey(id,name),
  visit_properties(visit_order, property:properties(*))
`;

// Marca se a visita ja passou da data e ainda nao foi atualizada (secao 19).
export function withNeedsUpdate(visit) {
  const past = new Date(visit.scheduled_at).getTime() < Date.now();
  const pending = visit.status === "MARCADA" || visit.status === "CONFIRMADA";
  return { ...visit, needs_update: past && pending };
}
