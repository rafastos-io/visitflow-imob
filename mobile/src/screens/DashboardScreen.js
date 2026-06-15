import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";

function Stat({ label, value, dot }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTop}>
        {dot && <View style={[styles.dot, { backgroundColor: dot }]} />}
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [data, setData] = useState(null);

  useFocusEffect(useCallback(() => {
    api("/dashboard/manager").then(setData).catch(() => {});
  }, []));

  if (!data) return <View style={styles.container} />;
  const t = data.totals;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.grid}>
        <Stat label="Marcadas" value={t.marcadas} dot="#7C8B84" />
        <Stat label="Confirmadas" value={t.confirmadas} dot="#2E7D6B" />
        <Stat label="Realizadas" value={t.realizadas} dot="#0E3B2E" />
        <Stat label="Canceladas" value={t.canceladas} dot="#B23A2E" />
        <Stat label="Quentes" value={t.clientesQuentes} dot="#C99A2E" />
        <Stat label="Propostas" value={t.propostas} dot="#C2603F" />
      </View>

      <View style={styles.highlight}>
        <Text style={styles.hlLabel}>Taxa de visita realizada</Text>
        <Text style={styles.hlValue}>{data.taxa_realizada}%</Text>
        <View style={styles.barBg}><View style={[styles.barFill, { width: `${data.taxa_realizada}%` }]} /></View>
      </View>

      <Text style={styles.section}>Média de estrelas por corretor</Text>
      {data.media_estrelas_por_corretor.map((b) => (
        <View key={b.broker_id} style={styles.rowItem}>
          <Text style={styles.rowName}>{b.name}</Text>
          <Text style={styles.rowStars}>{"★".repeat(Math.round(b.avg_score))}{"☆".repeat(5 - Math.round(b.avg_score))} {b.avg_score}</Text>
        </View>
      ))}

      <Text style={styles.section}>Imóveis mais visitados</Text>
      {data.imoveis_mais_visitados.length === 0 && <Text style={styles.empty}>Sem dados.</Text>}
      {data.imoveis_mais_visitados.map((p) => (
        <View key={p.title} style={styles.rowItem}>
          <Text style={styles.rowName} numberOfLines={1}>{p.title}</Text>
          <Text style={styles.rowCount}>{p.count}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  stat: { width: "47%", backgroundColor: colors.white, borderRadius: 12, padding: 14, flexGrow: 1 },
  statTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statLabel: { color: colors.graphite, opacity: 0.7, fontSize: 12, fontWeight: "600" },
  statValue: { color: colors.graphite, fontSize: 26, fontWeight: "bold", marginTop: 4 },
  highlight: { backgroundColor: colors.graphite, borderRadius: 14, padding: 16, marginTop: 14 },
  hlLabel: { color: colors.orange, fontSize: 12, fontWeight: "700" },
  hlValue: { color: colors.white, fontSize: 34, fontWeight: "bold", marginTop: 4 },
  barBg: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, marginTop: 8 },
  barFill: { height: 6, backgroundColor: colors.orange, borderRadius: 3 },
  section: { fontSize: 16, fontWeight: "700", color: colors.graphite, marginTop: 22, marginBottom: 8 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.white, borderRadius: 10, padding: 12, marginBottom: 8 },
  rowName: { color: colors.graphite, flex: 1, paddingRight: 8 },
  rowStars: { color: colors.orange, fontWeight: "600" },
  rowCount: { color: colors.graphite, fontWeight: "700" },
  empty: { color: colors.graphite, opacity: 0.5 },
});
