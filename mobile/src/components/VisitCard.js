import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, STATUS_LABELS, formatDate, stars } from "../theme";

export default function VisitCard({ visit, onPress }) {
  const count = visit.visit_properties?.length || 0;
  const hot = visit.status === "CLIENTE_QUENTE";
  return (
    <TouchableOpacity style={[styles.card, hot && styles.hot]} onPress={onPress} accessibilityRole="button">
      {visit.needs_update && <Text style={styles.alert}>⚠ Atualizar visita</Text>}
      <Text style={styles.client}>{visit.client?.name}</Text>
      <Text style={styles.meta}>Corretor: {visit.broker?.name}</Text>
      <Text style={styles.meta}>{formatDate(visit.scheduled_at)}</Text>
      <Text style={styles.meta}>Roteiro: {count} {count === 1 ? "imóvel" : "imóveis"}</Text>
      <View style={styles.row}>
        <Text style={styles.badge}>{STATUS_LABELS[visit.status]}</Text>
        <Text style={styles.stars}>{stars(visit.score)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  hot: { borderWidth: 1, borderColor: colors.orange },
  alert: { color: colors.orange, fontWeight: "700", marginBottom: 6, fontSize: 12 },
  client: { fontSize: 16, fontWeight: "700", color: colors.graphite },
  meta: { fontSize: 12, color: colors.graphite, opacity: 0.7, marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  badge: { backgroundColor: colors.peach, color: colors.graphite, fontSize: 11, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: "hidden" },
  stars: { color: colors.orange, fontSize: 13 },
});
