import { getUser, json, unauthorized } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { hotClients } from "@/lib/dashboard";

// GET /api/dashboard/hot-clients -> clientes quentes (nota >= 4)
export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const ids = await visibleBrokerIds(user);
  const data = await hotClients(ids);
  return json(data);
}
