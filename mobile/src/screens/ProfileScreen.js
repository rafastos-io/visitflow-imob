import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.role}>{user?.role === "GERENTE" ? "Gerente" : "Corretor"}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, alignItems: "center", paddingTop: 60 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.orange, justifyContent: "center", alignItems: "center" },
  avatarText: { color: colors.white, fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 22, fontWeight: "bold", color: colors.graphite, marginTop: 16 },
  role: { color: colors.orange, fontWeight: "600", marginTop: 4 },
  email: { color: colors.graphite, opacity: 0.7, marginTop: 4 },
  btn: { backgroundColor: colors.graphite, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 50, marginTop: 40 },
  btnText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
