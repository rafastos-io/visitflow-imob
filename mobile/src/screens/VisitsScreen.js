import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";
import VisitCard from "../components/VisitCard";

const FILTERS = [
  { key: "", label: "Todas" },
  { key: "MARCADA", label: "Marcadas" },
  { key: "CONFIRMADA", label: "Confirmadas" },
  { key: "REALIZADA", label: "Realizadas" },
  { key: "CLIENTE_QUENTE", label: "Quentes" },
  { key: "PROPOSTA_EM_ANDAMENTO", label: "Proposta" },
  { key: "CANCELADA", label: "Canceladas" },
];

export default function VisitsScreen({ navigation }) {
  const [visits, setVisits] = useState([]);
  const [status, setStatus] = useState("");

  const load = useCallback(() => {
    api("/visits").then(setVisits).catch(() => {});
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = status ? visits.filter((v) => v.status === status) : visits;

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f.key} style={[styles.chip, status === f.key && styles.chipOn]} onPress={() => setStatus(f.key)}>
              <Text style={[styles.chipText, status === f.key && styles.chipTextOn]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma visita.</Text>}
        renderItem={({ item }) => (
          <VisitCard visit={item} onPress={() => navigation.navigate("VisitDetail", { id: item.id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  filterBar: { paddingVertical: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#e3e7e0" },
  chip: { borderWidth: 1, borderColor: "#cdd5cf", backgroundColor: colors.white, borderRadius: 18, paddingVertical: 6, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.orange, borderColor: colors.orange },
  chipText: { color: colors.graphite, fontWeight: "600", fontSize: 13 },
  chipTextOn: { color: colors.graphite },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
});
