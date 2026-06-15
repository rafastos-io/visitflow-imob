import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";

const EMPTY = { title: "", neighborhood: "", city: "", type: "", area: "", bedrooms: "", price: "", address: "" };

function money(v) {
  if (v == null) return "—";
  return "R$ " + Math.round(Number(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function PropertiesScreen() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api("/properties").then(setItems).catch(() => {});
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  function openNew() {
    setEditId(null);
    setForm(EMPTY);
    setShow(true);
  }
  function openEdit(p) {
    setEditId(p.id);
    setForm({
      title: p.title || "", neighborhood: p.neighborhood || "", city: p.city || "", type: p.type || "",
      area: p.area != null ? String(p.area) : "", bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
      price: p.price != null ? String(p.price) : "", address: p.address || "",
    });
    setShow(true);
  }

  async function save() {
    if (!form.title.trim()) return Alert.alert("Atenção", "Informe o título do imóvel.");
    const num = (v) => (v === "" ? null : Number(v));
    const body = { ...form, area: num(form.area), bedrooms: num(form.bedrooms), price: num(form.price) };
    setSaving(true);
    try {
      if (editId) await api(`/properties/${editId}`, { method: "PUT", body: JSON.stringify(body) });
      else await api("/properties", { method: "POST", body: JSON.stringify(body) });
      setShow(false);
      load();
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert("Excluir imóvel", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          try { await api(`/properties/${editId}`, { method: "DELETE" }); setShow(false); load(); }
          catch (e) { Alert.alert("Erro", e.message); }
        } },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        ListHeaderComponent={<Text style={styles.title}>Imóveis</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum imóvel. Toque em + para cadastrar.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openEdit(item)}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.meta}>{item.neighborhood}{item.city ? ` · ${item.city}` : ""}</Text>
            <Text style={styles.meta}>{item.type}{item.bedrooms ? ` · ${item.bedrooms} dorm` : ""}{item.area ? ` · ${item.area} m²` : ""}</Text>
            <Text style={styles.price}>{money(item.price)}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openNew} accessibilityLabel="Cadastrar imóvel">
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={show} animationType="slide" transparent onRequestClose={() => setShow(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <ScrollView>
              <Text style={styles.sheetTitle}>{editId ? "Editar imóvel" : "Novo imóvel"}</Text>
              <TextInput style={styles.input} placeholder="Título" value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
              <TextInput style={styles.input} placeholder="Endereço" value={form.address} onChangeText={(v) => setForm((f) => ({ ...f, address: v }))} />
              <TextInput style={styles.input} placeholder="Bairro" value={form.neighborhood} onChangeText={(v) => setForm((f) => ({ ...f, neighborhood: v }))} />
              <TextInput style={styles.input} placeholder="Cidade" value={form.city} onChangeText={(v) => setForm((f) => ({ ...f, city: v }))} />
              <TextInput style={styles.input} placeholder="Tipo (Apartamento, Casa...)" value={form.type} onChangeText={(v) => setForm((f) => ({ ...f, type: v }))} />
              <TextInput style={styles.input} placeholder="Área (m²)" keyboardType="numeric" value={form.area} onChangeText={(v) => setForm((f) => ({ ...f, area: v }))} />
              <TextInput style={styles.input} placeholder="Dormitórios" keyboardType="numeric" value={form.bedrooms} onChangeText={(v) => setForm((f) => ({ ...f, bedrooms: v }))} />
              <TextInput style={styles.input} placeholder="Valor (R$)" keyboardType="numeric" value={form.price} onChangeText={(v) => setForm((f) => ({ ...f, price: v }))} />
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
                  <Text style={{ color: colors.red, fontWeight: "600" }}>Excluir imóvel</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
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
  price: { color: colors.graphite, fontWeight: "700", marginTop: 6 },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center", elevation: 4 },
  fabText: { color: colors.graphite, fontSize: 30, fontWeight: "bold", marginTop: -2 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "88%" },
  sheetTitle: { fontSize: 18, fontWeight: "bold", color: colors.graphite, marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 6 },
  btnPrimary: { backgroundColor: colors.graphite, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 },
  btnText: { color: colors.white, fontWeight: "bold" },
  btnGhost: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22 },
  btnGhostText: { color: colors.graphite, fontWeight: "600" },
});
