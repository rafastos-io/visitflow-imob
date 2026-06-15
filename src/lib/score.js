// Calculo da nota da visita (0 a 5) a partir do quiz pos-visita.
// Regras das secoes 8 e 9 da especificacao.
//
// feedback = {
//   was_completed: 'Sim' | 'Nao' | 'Parcialmente',
//   visited_count: '1' | '2 a 3' | '4 a 5' | 'Mais de 5',
//   interest_level: 'Nao' | 'Pouco' | 'Medio' | 'Alto',
//   has_proposal_intent: boolean,
//   general_perception: string,
//   notes: string
// }

export function calculateScore(feedback) {
  const { was_completed, interest_level, has_proposal_intent, general_perception } = feedback;

  // Visita nao realizada -> nota 0.
  if (was_completed === "Nao" || was_completed === "Não" || was_completed === false) {
    return 0;
  }

  // Intencao clara de proposta -> nota maxima.
  if (has_proposal_intent === true || general_perception === "Quer fazer proposta") {
    return 5;
  }

  switch (interest_level) {
    case "Alto":
      return 4;
    case "Medio":
    case "Médio":
      return 3;
    case "Pouco":
      return 1;
    case "Nao":
    case "Não":
      return 0;
    default:
      return 2;
  }
}

// Define o status da visita a partir da nota e do feedback.
export function statusFromFeedback(score, feedback) {
  if (feedback.has_proposal_intent === true || feedback.general_perception === "Quer fazer proposta") {
    return "PROPOSTA_EM_ANDAMENTO";
  }
  if (score >= 4) return "CLIENTE_QUENTE";
  if (feedback.was_completed === "Nao" || feedback.was_completed === "Não" || feedback.was_completed === false) {
    return "CANCELADA";
  }
  return "REALIZADA";
}
