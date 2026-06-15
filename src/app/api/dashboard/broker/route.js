import { getUser, json, unauthorized } from "@/lib/auth";
import { computeDashboard } from "@/lib/dashboard";

// GET /api/dashboard/broker -> indicadores apenas do proprio corretor
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const data = await computeDashboard([user.id]);
  return json(data);
}
