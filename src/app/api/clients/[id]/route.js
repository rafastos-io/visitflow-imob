import { db } from "@/lib/db";
import { getUser, json, unauthorized, forbidden } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";

async function loadVisible(user, id) {
  const ids = await visibleBrokerIds(user);
  const { data } = await db.from("clients").select("*").eq("id", id).single();
  if (!data) return { notFound: true };
  if (!ids.includes(data.broker_id)) return { forbidden: true };
  return { client: data };
}

export async function GET(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const res = await loadVisible(user, id);
  if (res.notFound) return json({ error: "Nao encontrado" }, 404);
  if (res.forbidden) return forbidden();
  return json(res.client);
}

export async function PUT(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const res = await loadVisible(user, id);
  if (res.notFound) return json({ error: "Nao encontrado" }, 404);
  if (res.forbidden) return forbidden();

  const body = await req.json().catch(() => ({}));
  const { data, error } = await db
    .from("clients")
    .update({
      name: body.name ?? res.client.name,
      phone: body.phone ?? res.client.phone,
      email: body.email ?? res.client.email,
      notes: body.notes ?? res.client.notes,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json(data);
}

export async function DELETE(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const res = await loadVisible(user, id);
  if (res.notFound) return json({ error: "Nao encontrado" }, 404);
  if (res.forbidden) return forbidden();

  const { error } = await db.from("clients").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
