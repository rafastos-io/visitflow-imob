import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";

export default function CorretoresScreen() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useFocusEffect(useCallback(() => {
    api("/users").then((u) => setUsers(u.filter((x) => x.role === "CORRETOR"))).catch(() => {});
    api("/dashboard/manager").then((d) => {
      const map = {};
      (d.media_estrelas_por_corretor || []).forEach((b) => { map[b.broker_id] = b; });
      setStats(map);
    }).catch(() => {});
  }, []));

  return (
    <FlatList
      style={styles.container}
      data={users}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={<Text style={styles.title}>Equipe de corretores</Text>}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum corretor.</Text>}
      renderItem={({ item }) => {
        const s = stats[item.id];
        return (
          <View style={styles.card}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name?.charAt(0)}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.email}</Text>
              <Text style={styles.meta}>Visitas realizadas: {s?.realizadas ?? 0} · ★ {s?.avg_score ?? 0}</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  title: { fontSize: 20, fontWeight: "bold", color: colors.graphite, marginBottom: 12 },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
  card: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.graphite, fontWeight: "bold", fontSize: 18 },
  name: { fontSize: 16, fontWeight: "700", color: colors.graphite },
  meta: { color: colors.graphite, opacity: 0.7, fontSize: 13, marginTop: 2 },
});
