import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";

// GET /api/notifications -> notificacoes do usuario logado
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const { data, error } = await db
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json(data);
}
