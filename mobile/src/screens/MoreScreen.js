import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function MoreScreen({ navigation }) {
  const { user, logout } = useAuth();

  const items = [
    { label: "Dashboard", icon: "📊", route: "Dashboard" },
    { label: "Agenda", icon: "🗓️", route: "Agenda" },
    { label: "Clientes Quentes", icon: "🔥", route: "Quentes" },
    { label: "Corretores", icon: "🧑‍💼", route: "Corretores", managerOnly: true },
    { label: "Relatórios", icon: "📈", route: "Relatorios" },
    { label: "Notificações", icon: "🔔", route: "Notificacoes" },
    { label: "Perfil", icon: "👤", route: "Perfil" },
  ].filter((i) => !i.managerOnly || user?.role === "GERENTE");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text></View>
        <View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.role === "GERENTE" ? "Gerente" : "Corretor"}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {items.map((i, idx) => (
          <TouchableOpacity
            key={i.route}
            style={[styles.row, idx < items.length - 1 && styles.rowBorder]}
            onPress={() => navigation.navigate(i.route)}
          >
            <Text style={styles.icon}>{i.icon}</Text>
            <Text style={styles.rowLabel}>{i.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.graphite, fontWeight: "bold", fontSize: 22 },
  name: { fontSize: 18, fontWeight: "bold", color: colors.graphite },
  role: { color: colors.graphite, opacity: 0.6 },
  menu: { backgroundColor: colors.white, borderRadius: 14, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 16, gap: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#eef0ec" },
  icon: { fontSize: 18 },
  rowLabel: { flex: 1, fontSize: 16, color: colors.graphite, fontWeight: "500" },
  chevron: { fontSize: 22, color: colors.graphite, opacity: 0.4 },
  logout: { marginTop: 20, backgroundColor: colors.graphite, borderRadius: 12, padding: 16, alignItems: "center" },
  logoutText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
