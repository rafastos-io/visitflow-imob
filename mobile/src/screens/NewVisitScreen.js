import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { api } from "../services/api";
import { colors } from "../theme";

const DATE_OPTIONS = [
  { label: "Hoje", days: 0 },
  { label: "Amanhã", days: 1 },
  { label: "Em 2 dias", days: 2 },
  { label: "Em 1 semana", days: 7 },
];

function money(v) {
  if (v == null) return "";
  return "R$ " + Math.round(Number(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function NewVisitScreen({ navigation }) {
  const [clients, setClients] = useState([]);
  const [properties, setProperties] = useState([]);
  const [clientId, setClientId] = useState("");
  const [propertyIds, setPropertyIds] = useState([]);
  const [days, setDays] = useState(1);
  const [time, setTime] = useState("14:00");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/clients").then(setClients).catch(() => {});
    api("/properties").then(setProperties).catch(() => {});
  }, []);

  function toggleProp(id) {
    setPropertyIds((arr) => (arr.includes(id) ? arr.filter((p) => p !== id) : [...arr, id]));
  }

  function buildScheduledAt() {
    const [h, m] = time.split(":").map((n) => parseInt(n, 10));
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(isNaN(h) ? 14 : h, isNaN(m) ? 0 : m, 0, 0);
    return d.toISOString();
  }

  async function save() {
    if (!clientId) return Alert.alert("Atenção", "Selecione um cliente.");
    setSaving(true);
    try {
      await api("/visits", {
        method: "POST",
        body: JSON.stringify({ client_id: clientId, scheduled_at: buildScheduledAt(), property_ids: propertyIds }),
      });
      Alert.alert("Pronto", "Visita criada com sucesso.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.section}>Cliente</Text>
      {clients.length === 0 && <Text style={styles.hint}>Nenhum cliente. Cadastre um na aba Clientes.</Text>}
      <View style={styles.wrap}>
        {clients.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.chip, clientId === c.id && styles.chipOn]}
            onPress={() => setClientId(c.id)}
          >
            <Text style={[styles.chipText, clientId === c.id && styles.chipTextOn]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Quando</Text>
      <View style={styles.wrap}>
        {DATE_OPTIONS.map((o) => (
          <TouchableOpacity key={o.label} style={[styles.chip, days === o.days && styles.chipOn]} onPress={() => setDays(o.days)}>
            <Text style={[styles.chipText, days === o.days && styles.chipTextOn]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>Horário</Text>
        <TextInput style={styles.timeInput} value={time} onChangeText={setTime} placeholder="14:00" maxLength={5} keyboardType="numbers-and-punctuation" />
      </View>

      <Text style={styles.section}>Roteiro de imóveis ({propertyIds.length})</Text>
      {properties.map((p) => {
        const on = propertyIds.includes(p.id);
        return (
          <TouchableOpacity key={p.id} style={[styles.propCard, on && styles.propOn]} onPress={() => toggleProp(p.id)}>
            <View style={styles.checkbox}>{on && <Text style={styles.check}>✓</Text>}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propTitle}>{p.title}</Text>
              <Text style={styles.propMeta}>{p.neighborhood} · {money(p.price)}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.save} onPress={save} disabled={saving}>
        <Text style={styles.saveText}>{saving ? "Criando..." : "Criar visita"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  section: { fontSize: 15, fontWeight: "700", color: colors.graphite, marginTop: 18, marginBottom: 8 },
  hint: { color: colors.graphite, opacity: 0.6, fontSize: 13 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#cdd5cf", backgroundColor: colors.white, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.orange, borderColor: colors.orange },
  chipText: { color: colors.graphite, fontWeight: "600" },
  chipTextOn: { color: colors.graphite },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 12 },
  timeLabel: { color: colors.graphite, fontWeight: "600" },
  timeInput: { borderWidth: 1, borderColor: "#cdd5cf", backgroundColor: colors.white, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, fontSize: 16, width: 100, textAlign: "center" },
  propCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "transparent" },
  propOn: { borderColor: colors.orange },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.orange, alignItems: "center", justifyContent: "center" },
  check: { color: colors.orange, fontWeight: "bold" },
  propTitle: { fontWeight: "700", color: colors.graphite },
  propMeta: { color: colors.graphite, opacity: 0.65, fontSize: 12, marginTop: 2 },
  save: { backgroundColor: colors.graphite, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  saveText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
