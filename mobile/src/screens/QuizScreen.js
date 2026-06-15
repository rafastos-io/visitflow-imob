import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { api } from "../services/api";
import { colors, stars } from "../theme";

const QUESTIONS = [
  { key: "was_completed", q: "A visita foi realizada?", options: ["Sim", "Nao", "Parcialmente"] },
  { key: "visited_count", q: "Quantos imoveis foram visitados?", options: ["1", "2 a 3", "4 a 5", "Mais de 5"] },
  { key: "interest_level", q: "O cliente demonstrou interesse?", options: ["Nao", "Pouco", "Medio", "Alto"] },
  { key: "has_proposal_intent", q: "Algum imovel gerou possibilidade de proposta?", options: ["Sim", "Nao"], bool: true },
  {
    key: "general_perception",
    q: "Qual foi a percepcao geral do cliente?",
    options: ["Nao gostou dos imoveis", "Gostou parcialmente", "Gostou, mas quer ver novas opcoes", "Gostou muito", "Quer fazer proposta"],
  },
];

export default function QuizScreen({ route, navigation }) {
  const { id, client } = route.params;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  async function choose(option, isBool) {
    const value = isBool ? option === "Sim" : option;
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const res = await api(`/visits/${id}/feedback`, { method: "POST", body: JSON.stringify(updated) });
        setResult(res);
      } catch (e) {
        Alert.alert("Erro", e.message);
      }
    }
  }

  if (result) {
    return (
      <View style={styles.center}>
        <Text style={styles.resultTitle}>Visita avaliada!</Text>
        <Text style={styles.resultStars}>{stars(result.score)}</Text>
        <Text style={styles.resultScore}>Nota {result.score} de 5</Text>
        <Text style={styles.resultStatus}>Status: {result.status}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Tabs")}>
          <Text style={styles.btnText}>Concluir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.counter}>Pergunta {step + 1} de {QUESTIONS.length}</Text>
      <Text style={styles.client}>{client}</Text>
      <Text style={styles.question}>{current.q}</Text>

      <View style={{ marginTop: 16 }}>
        {current.options.map((o) => (
          <TouchableOpacity key={o} style={styles.option} onPress={() => choose(o, current.bool)}>
            <Text style={styles.optionText}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 20 },
  progressBg: { height: 8, backgroundColor: "#eee", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, backgroundColor: colors.orange },
  counter: { color: colors.graphite, opacity: 0.6, marginTop: 12 },
  client: { color: colors.graphite, opacity: 0.8, marginTop: 4 },
  question: { fontSize: 20, fontWeight: "bold", color: colors.graphite, marginTop: 12 },
  option: { backgroundColor: colors.white, borderRadius: 12, padding: 18, marginBottom: 12, elevation: 1 },
  optionText: { fontSize: 16, color: colors.graphite, fontWeight: "600" },
  center: { flex: 1, backgroundColor: colors.cream, justifyContent: "center", alignItems: "center", padding: 20 },
  resultTitle: { fontSize: 22, fontWeight: "bold", color: colors.graphite },
  resultStars: { fontSize: 40, color: colors.orange, marginTop: 16 },
  resultScore: { fontSize: 18, color: colors.graphite, marginTop: 8 },
  resultStatus: { color: colors.graphite, opacity: 0.7, marginTop: 6 },
  btn: { backgroundColor: colors.orange, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 40, marginTop: 30 },
  btnText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
