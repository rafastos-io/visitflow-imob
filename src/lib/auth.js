import jwt from "jsonwebtoken";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-troque-em-producao";
const EXPIRES_IN = "7d";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Le o usuario autenticado a partir do header Authorization: Bearer <token>.
// Retorna o registro completo do usuario (do banco) ou null.
export async function getUser(req) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  const { data, error } = await db
    .from("users")
    .select("id, name, email, role, manager_id")
    .eq("id", payload.sub)
    .single();

  if (error || !data) return null;
  return data;
}

// Helpers de resposta JSON padronizados.
export function json(data, status = 200) {
  return Response.json(data, { status });
}

export function unauthorized() {
  return Response.json({ error: "Nao autenticado" }, { status: 401 });
}

export function forbidden() {
  return Response.json({ error: "Sem permissao" }, { status: 403 });
}
