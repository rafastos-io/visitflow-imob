import { getUser, json, unauthorized } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { computeDashboard } from "@/lib/dashboard";

// GET /api/dashboard/manager -> indicadores da equipe visivel
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const ids = await visibleBrokerIds(user);
  const data = await computeDashboard(ids);
  return json(data);
}
