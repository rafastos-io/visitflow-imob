import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api, getUser } from "../services/api";
import { colors, STATUS_LABELS, formatDate, stars } from "../theme";

const STATUS_FILTERS = [
  { key: "", label: "Todos" },
  { key: "MARCADA", label: "Marcadas" },
  { key: "CONFIRMADA", label: "Confirmadas" },
  { key: "REALIZADA", label: "Realizadas" },
  { key: "CLIENTE_QUENTE", label: "Quentes" },
  { key: "PROPOSTA_EM_ANDAMENTO", label: "Proposta" },
  { key: "CANCELADA", label: "Canceladas" },
];

export default function RelatoriosScreen() {
  const [visits, setVisits] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [status, setStatus] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [isManager, setIsManager] = useState(false);

  useFocusEffect(useCallback(() => {
    api("/visits").then(setVisits).catch(() => {});
    getUser().then((u) => {
      setIsManager(u?.role === "GERENTE");
      if (u?.role === "GERENTE") api("/users").then((all) => setBrokers(all.filter((x) => x.role === "CORRETOR"))).catch(() => {});
    });
  }, []));

  const filtered = visits.filter((v) => (!status || v.status === status) && (!brokerId || v.broker_id === brokerId));

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity key={f.key} style={[styles.chip, status === f.key && styles.chipOn]} onPress={() => setStatus(f.key)}>
              <Text style={[styles.chipText, status === f.key && styles.chipTextOn]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isManager && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, marginTop: 8 }}>
            <TouchableOpacity style={[styles.chip, brokerId === "" && styles.chipOn]} onPress={() => setBrokerId("")}>
              <Text style={[styles.chipText, brokerId === "" && styles.chipTextOn]}>Todos corretores</Text>
            </TouchableOpacity>
            {brokers.map((b) => (
              <TouchableOpacity key={b.id} style={[styles.chip, brokerId === b.id && styles.chipOn]} onPress={() => setBrokerId(b.id)}>
                <Text style={[styles.chipText, brokerId === b.id && styles.chipTextOn]}>{b.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.count}>{filtered.length} visita(s)</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma visita.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.client?.name}</Text>
              <Text style={styles.meta}>{item.broker?.name} · {formatDate(item.scheduled_at)}</Text>
              <Text style={styles.meta}>{STATUS_LABELS[item.status]} · {item.visit_properties?.length || 0} imóvel(is)</Text>
            </View>
            <Text style={styles.stars}>{stars(item.score)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  bar: { paddingVertical: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#e3e7e0" },
  chip: { borderWidth: 1, borderColor: "#cdd5cf", backgroundColor: colors.white, borderRadius: 18, paddingVertical: 6, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.orange, borderColor: colors.orange },
  chipText: { color: colors.graphite, fontWeight: "600", fontSize: 13 },
  chipTextOn: { color: colors.graphite },
  count: { color: colors.graphite, opacity: 0.7, marginBottom: 10, fontWeight: "600" },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 12, padding: 12, marginBottom: 8 },
  name: { fontSize: 15, fontWeight: "700", color: colors.graphite },
  meta: { color: colors.graphite, opacity: 0.7, fontSize: 12, marginTop: 2 },
  stars: { color: colors.orange, fontSize: 12 },
});
