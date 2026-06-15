import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";

// GET /api/users -> corretores visiveis (equipe do gerente ou o proprio corretor)
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const ids = await visibleBrokerIds(user);
  const { data, error } = await db
    .from("users")
    .select("id, name, email, role, manager_id, created_at")
    .in("id", ids)
    .order("name");

  if (error) return json({ error: error.message }, 500);
  return json(data);
}
