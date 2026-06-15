import { db } from "@/lib/db";
import { getUser, json, unauthorized, forbidden } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { VISIT_SELECT, withNeedsUpdate } from "@/lib/visits";

const VALID = ["MARCADA", "CONFIRMADA", "REALIZADA", "CLIENTE_QUENTE", "PROPOSTA_EM_ANDAMENTO", "CANCELADA"];

// PATCH /api/visits/:id/status  { status, notes? }
export async function PATCH(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const b = await req.json().catch(() => ({}));
  if (!VALID.includes(b.status)) return json({ error: "Status invalido" }, 400);

  const { data: visit } = await db.from("visits").select("broker_id").eq("id", id).single();
  if (!visit) return json({ error: "Nao encontrado" }, 404);
  const ids = await visibleBrokerIds(user);
  if (!ids.includes(visit.broker_id)) return forbidden();

  const update = { status: b.status, updated_at: new Date().toISOString() };
  if (b.notes !== undefined) update.notes = b.notes;

  const { error } = await db.from("visits").update(update).eq("id", id);
  if (error) return json({ error: error.message }, 500);

  const { data: full } = await db.from("visits").select(VISIT_SELECT).eq("id", id).single();
  return json(withNeedsUpdate(full));
}
