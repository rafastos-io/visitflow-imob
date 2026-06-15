import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("joao@visitflow.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VisitFlow <Text style={{ color: colors.orange }}>Imob</Text></Text>
      <Text style={styles.subtitle}>Gestão inteligente de visitas</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Campo de e-mail"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Campo de senha"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Teste: joao@visitflow.com / ana@visitflow.com{"\n"}Senha: 123456</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "bold", color: colors.graphite, textAlign: "center" },
  subtitle: { color: colors.graphite, textAlign: "center", marginBottom: 24, opacity: 0.7 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, elevation: 2 },
  label: { color: colors.graphite, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 16 },
  button: { backgroundColor: colors.orange, borderRadius: 10, padding: 16, marginTop: 20, alignItems: "center" },
  buttonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  hint: { textAlign: "center", marginTop: 20, color: colors.graphite, opacity: 0.6, fontSize: 12 },
});
