import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";

// GET /api/properties -> imoveis sao compartilhados por toda a equipe
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const { data, error } = await db
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json(data);
}

export async function POST(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const b = await req.json().catch(() => ({}));
  if (!b.title) return json({ error: "Titulo obrigatorio" }, 400);

  const { data, error } = await db
    .from("properties")
    .insert({
      title: b.title,
      address: b.address || null,
      neighborhood: b.neighborhood || null,
      city: b.city || null,
      type: b.type || null,
      area: b.area ?? null,
      bedrooms: b.bedrooms ?? null,
      suites: b.suites ?? null,
      parking_spaces: b.parking_spaces ?? null,
      price: b.price ?? null,
      status: b.status || "Disponível",
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json(data, 201);
}
