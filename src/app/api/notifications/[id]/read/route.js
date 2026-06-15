import { db } from "@/lib/db";
import { getUser, json, unauthorized } from "@/lib/auth";

// PATCH /api/notifications/:id/read -> marca como lida
export async function PATCH(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data, error } = await db
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json(data);
}
