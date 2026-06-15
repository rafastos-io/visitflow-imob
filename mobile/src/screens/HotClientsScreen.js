import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors, stars, formatDate } from "../theme";

export default function HotClientsScreen() {
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      api("/dashboard/hot-clients").then(setItems).catch(() => {});
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Text style={styles.title}>🔥 Clientes Quentes</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente quente ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.client?.name}</Text>
            <Text style={styles.meta}>📞 {item.client?.phone || "—"}</Text>
            <Text style={styles.meta}>{formatDate(item.scheduled_at)}</Text>
            <Text style={styles.stars}>{stars(item.score)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  title: { fontSize: 20, fontWeight: "bold", color: colors.graphite, marginBottom: 12 },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.orange },
  name: { fontSize: 16, fontWeight: "700", color: colors.graphite },
  meta: { color: colors.graphite, opacity: 0.7, marginTop: 2, fontSize: 12 },
  stars: { color: colors.orange, fontSize: 15, marginTop: 6 },
});
