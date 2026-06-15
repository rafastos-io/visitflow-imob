import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors, STATUS_LABELS, formatDate, stars } from "../theme";

export default function VisitDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [visit, setVisit] = useState(null);

  const load = useCallback(() => {
    api(`/visits/${id}`).then(setVisit).catch((e) => Alert.alert("Erro", e.message));
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function setStatus(status) {
    try {
      await api(`/visits/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      load();
    } catch (e) {
      Alert.alert("Erro", e.message);
    }
  }

  if (!visit) return <View style={styles.container} />;

  const props = (visit.visit_properties || []).sort((a, b) => (a.visit_order || 0) - (b.visit_order || 0));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <Text style={styles.name}>{visit.client?.name}</Text>
        <Text style={styles.meta}>📞 {visit.client?.phone || "—"}</Text>
        <Text style={styles.meta}>🗓 {formatDate(visit.scheduled_at)}</Text>
        <Text style={styles.meta}>Corretor: {visit.broker?.name}</Text>
        <View style={styles.row}>
          <Text style={styles.badge}>{STATUS_LABELS[visit.status]}</Text>
          <Text style={styles.stars}>{stars(visit.score)}</Text>
        </View>
      </View>

      <Text style={styles.section}>Roteiro de imóveis ({props.length})</Text>
      {props.map((vp) => (
        <View key={vp.property?.id} style={styles.propCard}>
          <Text style={styles.propTitle}>{vp.visit_order}. {vp.property?.title}</Text>
          <Text style={styles.meta}>{vp.property?.neighborhood} · {vp.property?.city}</Text>
          <Text style={styles.meta}>{vp.property?.bedrooms} dorm · {vp.property?.area} m²</Text>
        </View>
      ))}

      <View style={{ marginTop: 20 }}>
        {visit.status === "MARCADA" && (
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setStatus("CONFIRMADA")}>
            <Text style={styles.btnText}>Confirmar visita</Text>
          </TouchableOpacity>
        )}
        {(visit.status === "CONFIRMADA" || visit.status === "REALIZADA" || visit.needs_update) && (
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate("Quiz", { id: visit.id, client: visit.client?.name })}>
            <Text style={styles.btnText}>Responder quiz pós-visita</Text>
          </TouchableOpacity>
        )}
        {["MARCADA", "CONFIRMADA"].includes(visit.status) && (
          <TouchableOpacity style={styles.btnGhost} onPress={() => setStatus("CANCELADA")}>
            <Text style={styles.btnGhostText}>Cancelar visita</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  card: { backgroundColor: colors.white, borderRadius: 14, padding: 16, elevation: 1 },
  name: { fontSize: 20, fontWeight: "bold", color: colors.graphite },
  meta: { color: colors.graphite, opacity: 0.75, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  badge: { backgroundColor: colors.peach, color: colors.graphite, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: "hidden" },
  stars: { color: colors.orange, fontSize: 15 },
  section: { fontSize: 16, fontWeight: "700", color: colors.graphite, marginTop: 20, marginBottom: 8 },
  propCard: { backgroundColor: colors.white, borderRadius: 12, padding: 12, marginBottom: 8 },
  propTitle: { fontWeight: "700", color: colors.graphite },
  btnPrimary: { backgroundColor: colors.orange, borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 10 },
  btnText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  btnGhost: { borderWidth: 1, borderColor: colors.red, borderRadius: 12, padding: 16, alignItems: "center" },
  btnGhostText: { color: colors.red, fontWeight: "bold" },
});
