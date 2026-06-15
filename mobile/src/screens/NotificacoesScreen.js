import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors, formatDate } from "../theme";

export default function NotificacoesScreen() {
  const [items, setItems] = useState([]);

  const load = useCallback(() => {
    api("/notifications").then(setItems).catch(() => {});
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function markRead(n) {
    if (n.read) return;
    try {
      await api(`/notifications/${n.id}/read`, { method: "PATCH" });
      setItems((arr) => arr.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    } catch {}
  }

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={[styles.card, !item.read && styles.unread]} onPress={() => markRead(item)}>
          <View style={styles.top}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.dot} />}
          </View>
          <Text style={styles.msg}>{item.message}</Text>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10, opacity: 0.7 },
  unread: { opacity: 1, borderLeftWidth: 3, borderLeftColor: colors.orange },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 15, fontWeight: "700", color: colors.graphite },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange },
  msg: { color: colors.graphite, opacity: 0.8, marginTop: 4, fontSize: 13 },
  date: { color: colors.graphite, opacity: 0.4, marginTop: 6, fontSize: 11 },
});
