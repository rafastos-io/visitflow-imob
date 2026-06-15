import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { colors, formatDate } from "../theme";
import VisitCard from "../components/VisitCard";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    api("/visits").then(setVisits).catch(() => {});
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function onRefresh() {
    setRefreshing(true);
    api("/visits").then(setVisits).finally(() => setRefreshing(false));
  }

  const today = new Date().toDateString();
  const todayVisits = visits.filter((v) => new Date(v.scheduled_at).toDateString() === today);
  const pending = visits.filter((v) => v.needs_update);
  const next = visits
    .filter((v) => new Date(v.scheduled_at) >= new Date() && ["MARCADA", "CONFIRMADA"].includes(v.status))
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>Ola, {user?.name?.split(" ")[0]} 👋</Text>
      <Text style={styles.sub}>{todayVisits.length} visita(s) hoje</Text>

      {pending.length > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            ⚠ Voce possui {pending.length} visita(s) que ja deveriam ter sido realizadas. Atualize o status e responda o quiz.
          </Text>
        </View>
      )}

      {next && (
        <>
          <Text style={styles.section}>Proxima visita</Text>
          <VisitCard visit={next} onPress={() => navigation.navigate("VisitDetail", { id: next.id })} />
        </>
      )}

      <Text style={styles.section}>Visitas de hoje</Text>
      {todayVisits.length === 0 && <Text style={styles.empty}>Nenhuma visita para hoje.</Text>}
      {todayVisits.map((v) => (
        <VisitCard key={v.id} visit={v} onPress={() => navigation.navigate("VisitDetail", { id: v.id })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  greeting: { fontSize: 22, fontWeight: "bold", color: colors.graphite },
  sub: { color: colors.graphite, opacity: 0.7, marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "700", color: colors.graphite, marginTop: 16, marginBottom: 8 },
  empty: { color: colors.graphite, opacity: 0.5 },
  alertBox: { backgroundColor: "#FFF3E6", borderRadius: 12, padding: 12, marginTop: 8 },
  alertText: { color: colors.orange, fontWeight: "600", fontSize: 13 },
});
