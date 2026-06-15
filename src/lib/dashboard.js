import { db } from "./db";

// Calcula os indicadores do dashboard para um conjunto de corretores (ids).
export async function computeDashboard(ids) {
  const { data: visits } = await db
    .from("visits")
    .select(`id, status, score, broker_id, broker:users!visits_broker_id_fkey(id,name), visit_properties(property_id, property:properties(id,title))`)
    .in("broker_id", ids);

  const v = visits || [];
  const countBy = (s) => v.filter((x) => x.status === s).length;

  const marcadas = countBy("MARCADA");
  const confirmadas = countBy("CONFIRMADA");
  const realizadas = countBy("REALIZADA");
  const canceladas = countBy("CANCELADA");
  const clientesQuentes = countBy("CLIENTE_QUENTE");
  const propostas = countBy("PROPOSTA_EM_ANDAMENTO");

  // realizada = realizada + cliente quente + proposta (todas efetivadas)
  const efetivadas = realizadas + clientesQuentes + propostas;
  const totalFinalizadas = efetivadas + canceladas;
  const taxaRealizada = totalFinalizadas > 0 ? Math.round((efetivadas / totalFinalizadas) * 100) : 0;

  // media de estrelas por corretor
  const byBroker = {};
  for (const x of v) {
    const name = x.broker?.name || "—";
    const bid = x.broker_id;
    if (!byBroker[bid]) byBroker[bid] = { broker_id: bid, name, scores: [], realizadas: 0 };
    if (x.score !== null && x.score !== undefined) byBroker[bid].scores.push(x.score);
    if (["REALIZADA", "CLIENTE_QUENTE", "PROPOSTA_EM_ANDAMENTO"].includes(x.status)) {
      byBroker[bid].realizadas += 1;
    }
  }
  const brokers = Object.values(byBroker).map((b) => ({
    broker_id: b.broker_id,
    name: b.name,
    avg_score: b.scores.length ? +(b.scores.reduce((a, c) => a + c, 0) / b.scores.length).toFixed(1) : 0,
    realizadas: b.realizadas,
  }));

  // imoveis mais visitados
  const propCount = {};
  for (const x of v) {
    for (const vp of x.visit_properties || []) {
      const t = vp.property?.title || "Imovel";
      propCount[t] = (propCount[t] || 0) + 1;
    }
  }
  const topProperties = Object.entries(propCount)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totals: { marcadas, confirmadas, realizadas, canceladas, clientesQuentes, propostas },
    total_visitas: v.length,
    taxa_realizada: taxaRealizada,
    media_estrelas_por_corretor: brokers.sort((a, b) => b.avg_score - a.avg_score),
    corretores_mais_visitas: [...brokers].sort((a, b) => b.realizadas - a.realizadas).slice(0, 5),
    imoveis_mais_visitados: topProperties,
  };
}

// Lista clientes "quentes" (visitas com nota >= 4) visiveis ao conjunto de ids.
export async function hotClients(ids) {
  const { data } = await db
    .from("visits")
    .select(`id, score, status, scheduled_at, client:clients(id,name,phone,email), broker:users!visits_broker_id_fkey(id,name)`)
    .in("broker_id", ids)
    .gte("score", 4)
    .order("score", { ascending: false });
  return data || [];
}
