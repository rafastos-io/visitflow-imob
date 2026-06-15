import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";

export async function GET(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const { data } = await db.from("properties").select("*").eq("id", id).single();
  if (!data) return json({ error: "Nao encontrado" }, 404);
  return json(data);
}

export async function PUT(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  const { data, error } = await db
    .from("properties")
    .update({
      title: b.title,
      address: b.address,
      neighborhood: b.neighborhood,
      city: b.city,
      type: b.type,
      area: b.area,
      bedrooms: b.bedrooms,
      suites: b.suites,
      parking_spaces: b.parking_spaces,
      price: b.price,
      status: b.status,
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
  const { error } = await db.from("properties").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
