import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { VISIT_SELECT, withNeedsUpdate } from "@/lib/visits";

// GET /api/visits?status=&broker_id= -> lista visitas visiveis
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const brokerFilter = url.searchParams.get("broker_id");

  const ids = await visibleBrokerIds(user);
  let query = db.from("visits").select(VISIT_SELECT).in("broker_id", ids);

  if (status) query = query.eq("status", status);
  if (brokerFilter && ids.includes(brokerFilter)) query = query.eq("broker_id", brokerFilter);

  const { data, error } = await query.order("scheduled_at", { ascending: true });
  if (error) return json({ error: error.message }, 500);

  return json((data || []).map(withNeedsUpdate));
}

// POST /api/visits -> cria visita com roteiro de imoveis
export async function POST(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const b = await req.json().catch(() => ({}));
  if (!b.client_id || !b.scheduled_at) {
    return json({ error: "client_id e scheduled_at sao obrigatorios" }, 400);
  }

  const brokerId = b.broker_id || user.id;
  const { data: brokerRow } = await db
    .from("users")
    .select("manager_id")
    .eq("id", brokerId)
    .single();
  const managerId = brokerRow?.manager_id || (user.role === "GERENTE" ? user.id : user.manager_id);

  const { data: visit, error } = await db
    .from("visits")
    .insert({
      client_id: b.client_id,
      broker_id: brokerId,
      manager_id: managerId,
      scheduled_at: b.scheduled_at,
      status: "MARCADA",
      notes: b.notes || null,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);

  const propertyIds = Array.isArray(b.property_ids) ? b.property_ids : [];
  if (propertyIds.length > 0) {
    const rows = propertyIds.map((pid, i) => ({
      visit_id: visit.id,
      property_id: pid,
      visit_order: i + 1,
    }));
    await db.from("visit_properties").insert(rows);
  }

  const { data: full } = await db.from("visits").select(VISIT_SELECT).eq("id", visit.id).single();
  return json(withNeedsUpdate(full), 201);
}
