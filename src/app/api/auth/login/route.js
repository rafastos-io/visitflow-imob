import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, json } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return json({ error: "Informe email e senha" }, 400);
  }

  const { data: user } = await db
    .from("users")
    .select("id, name, email, role, manager_id, password_hash")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (!user) return json({ error: "Credenciais invalidas" }, 401);

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return json({ error: "Credenciais invalidas" }, 401);

  const token = signToken(user);
  return json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      manager_id: user.manager_id,
    },
  });
}
