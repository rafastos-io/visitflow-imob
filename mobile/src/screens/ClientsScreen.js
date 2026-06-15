import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";

const EMPTY = { name: "", phone: "", email: "", notes: "" };

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api("/clients").then(setClients).catch(() => {});
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  function openNew() {
    setEditId(null);
    setForm(EMPTY);
    setShow(true);
  }
  function openEdit(c) {
    setEditId(c.id);
    setForm({ name: c.name || "", phone: c.phone || "", email: c.email || "", notes: c.notes || "" });
    setShow(true);
  }

  async function save() {
    if (!form.name.trim()) return Alert.alert("Atenção", "Informe o nome do cliente.");
    setSaving(true);
    try {
      if (editId) await api(`/clients/${editId}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/clients", { method: "POST", body: JSON.stringify(form) });
      setShow(false);
      load();
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert("Excluir cliente", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          try { await api(`/clients/${editId}`, { method: "DELETE" }); setShow(false); load(); }
          catch (e) { Alert.alert("Erro", e.message); }
        } },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        ListHeaderComponent={<Text style={styles.title}>Meus clientes</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente ainda. Toque em + para cadastrar.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openEdit(item)}>
            <Text style={styles.name}>{item.name}</Text>
            {!!item.phone && <Text style={styles.meta}>📞 {item.phone}</Text>}
            {!!item.email && <Text style={styles.meta}>✉ {item.email}</Text>}
            {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openNew} accessibilityLabel="Novo cliente">
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={show} animationType="slide" transparent onRequestClose={() => setShow(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{editId ? "Editar cliente" : "Novo cliente"}</Text>
            <TextInput style={styles.input} placeholder="Nome" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
            <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm((f) => ({ ...f, email: v }))} />
            <TextInput style={[styles.input, { height: 70 }]} placeholder="Observações" multiline value={form.notes} onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))} />
            <View style={styles.row}>
              <TouchableOpacity style={styles.btnGhost} onPress={() => setShow(false)}>
                <Text style={styles.btnGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={save} disabled={saving}>
                <Text style={styles.btnText}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>
            {editId && (
              <TouchableOpacity onPress={confirmDelete} style={{ marginTop: 12, alignItems: "center" }}>
                <Text style={{ color: colors.red, fontWeight: "600" }}>Excluir cliente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  title: { fontSize: 20, fontWeight: "bold", color: colors.graphite, marginBottom: 12 },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "700", color: colors.graphite },
  meta: { color: colors.graphite, opacity: 0.7, marginTop: 2, fontSize: 13 },
  notes: { color: colors.graphite, opacity: 0.6, marginTop: 4, fontSize: 12, fontStyle: "italic" },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center", elevation: 4 },
  fabText: { color: colors.graphite, fontSize: 30, fontWeight: "bold", marginTop: -2 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: "bold", color: colors.graphite, marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 6 },
  btnPrimary: { backgroundColor: colors.graphite, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 },
  btnText: { color: colors.white, fontWeight: "bold" },
  btnGhost: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 },
  btnGhostText: { color: colors.graphite, fontWeight: "600" },
});
