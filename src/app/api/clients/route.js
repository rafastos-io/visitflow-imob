import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";

// GET /api/clients -> lista clientes visiveis ao usuario
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const ids = await visibleBrokerIds(user);
  const { data, error } = await db
    .from("clients")
    .select("*")
    .in("broker_id", ids)
    .order("created_at", { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json(data);
}

// POST /api/clients -> cria cliente para o proprio corretor (ou gerente)
export async function POST(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => ({}));
  if (!body.name) return json({ error: "Nome obrigatorio" }, 400);

  const { data, error } = await db
    .from("clients")
    .insert({
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      notes: body.notes || null,
      broker_id: body.broker_id || user.id,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json(data, 201);
}
