import { getUser, json, unauthorized } from "@/lib/auth";

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  return json({ user });
}
