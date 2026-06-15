import { db } from "./db";

// Retorna a lista de IDs de corretores que o usuario pode "enxergar".
// - CORRETOR: apenas ele mesmo.
// - GERENTE: ele mesmo + todos os corretores cujo manager_id = gerente.id.
export async function visibleBrokerIds(user) {
  if (user.role === "CORRETOR") return [user.id];

  const { data } = await db
    .from("users")
    .select("id")
    .eq("manager_id", user.id);

  const ids = (data || []).map((u) => u.id);
  ids.push(user.id); // o proprio gerente tambem pode ter visitas
  return ids;
}

export function isManager(user) {
  return user.role === "GERENTE";
}
