import React, { useCallback, useState } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { colors } from "../theme";
import VisitCard from "../components/VisitCard";

export default function AgendaScreen({ navigation }) {
  const [sections, setSections] = useState([]);

  const load = useCallback(() => {
    api("/visits").then((visits) => {
      const groups = {};
      visits.forEach((v) => {
        const day = new Date(v.scheduled_at).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
        groups[day] = groups[day] || [];
        groups[day].push(v);
      });
      setSections(Object.entries(groups).map(([title, data]) => ({ title, data })));
    }).catch(() => {});
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
        renderItem={({ item }) => (
          <VisitCard visit={item} onPress={() => navigation.navigate("VisitDetail", { id: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma visita na agenda.</Text>}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { fontSize: 14, fontWeight: "700", color: colors.graphite, marginTop: 14, marginBottom: 6, textTransform: "capitalize" },
  empty: { color: colors.graphite, opacity: 0.5, textAlign: "center", marginTop: 40 },
});
