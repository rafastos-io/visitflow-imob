import { db } from "@/lib/db";
import { getUser, json, unauthorized, forbidden } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { VISIT_SELECT, withNeedsUpdate } from "@/lib/visits";

export async function GET(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data, error } = await db.from("visits").select(VISIT_SELECT).eq("id", id).single();
  if (error || !data) return json({ error: "Nao encontrado" }, 404);

  const ids = await visibleBrokerIds(user);
  if (!ids.includes(data.broker_id)) return forbidden();

  return json(withNeedsUpdate(data));
}

// PATCH /api/visits/:id  { scheduled_at?, notes? } -> reagendar / editar observacoes
export async function PATCH(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data: visit } = await db.from("visits").select("broker_id").eq("id", id).single();
  if (!visit) return json({ error: "Nao encontrado" }, 404);
  const ids = await visibleBrokerIds(user);
  if (!ids.includes(visit.broker_id)) return forbidden();

  const b = await req.json().catch(() => ({}));
  const update = { updated_at: new Date().toISOString() };
  if (b.scheduled_at !== undefined) update.scheduled_at = b.scheduled_at;
  if (b.notes !== undefined) update.notes = b.notes;

  const { error } = await db.from("visits").update(update).eq("id", id);
  if (error) return json({ error: error.message }, 500);

  const { data: full } = await db.from("visits").select(VISIT_SELECT).eq("id", id).single();
  return json(withNeedsUpdate(full));
}

export async function DELETE(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data } = await db.from("visits").select("broker_id").eq("id", id).single();
  if (!data) return json({ error: "Nao encontrado" }, 404);
  const ids = await visibleBrokerIds(user);
  if (!ids.includes(data.broker_id)) return forbidden();

  const { error } = await db.from("visits").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
