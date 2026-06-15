import { db } from "@/lib/db";
import { getUser, json, unauthorized, forbidden } from "@/lib/auth";
import { visibleBrokerIds } from "@/lib/permissions";
import { calculateScore, statusFromFeedback } from "@/lib/score";
import { VISIT_SELECT, withNeedsUpdate } from "@/lib/visits";

export async function GET(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data } = await db
    .from("visit_feedbacks")
    .select("*")
    .eq("visit_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return json(data || null);
}

// POST /api/visits/:id/feedback -> registra quiz, calcula nota e atualiza status
export async function POST(req, { params }) {
  const user = await getUser(req);
  if (!user) return unauthorized();
  const { id } = await params;

  const { data: visit } = await db
    .from("visits")
    .select("id, broker_id, client_id")
    .eq("id", id)
    .single();
  if (!visit) return json({ error: "Nao encontrado" }, 404);

  const ids = await visibleBrokerIds(user);
  if (!ids.includes(visit.broker_id)) return forbidden();

  const b = await req.json().catch(() => ({}));
  const score = calculateScore(b);
  const newStatus = statusFromFeedback(score, b);

  // 1. grava o feedback
  const { data: feedback, error: fbErr } = await db
    .from("visit_feedbacks")
    .insert({
      visit_id: id,
      was_completed: typeof b.was_completed === "boolean" ? b.was_completed : b.was_completed === "Sim",
      visited_count: b.visited_count || null,
      interest_level: b.interest_level || null,
      has_proposal_intent: !!b.has_proposal_intent,
      general_perception: b.general_perception || null,
      notes: b.notes || null,
      score,
    })
    .select()
    .single();
  if (fbErr) return json({ error: fbErr.message }, 500);

  // 2. atualiza a visita com nota e status
  await db
    .from("visits")
    .update({ score, status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  // 3. cria notificacao de cliente quente / proposta (simulacao de alerta)
  if (newStatus === "CLIENTE_QUENTE" || newStatus === "PROPOSTA_EM_ANDAMENTO") {
    const title = newStatus === "PROPOSTA_EM_ANDAMENTO" ? "Proposta em andamento" : "Cliente quente";
    await db.from("notifications").insert({
      user_id: visit.broker_id,
      visit_id: id,
      title,
      message: `Visita avaliada com nota ${score}. ${title}: priorize o follow-up.`,
    });
  }

  const { data: full } = await db.from("visits").select(VISIT_SELECT).eq("id", id).single();
  return json({ feedback, score, status: newStatus, visit: withNeedsUpdate(full) }, 201);
}
