import React from "react";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { colors } from "./src/theme";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import VisitsScreen from "./src/screens/VisitsScreen";
import AgendaScreen from "./src/screens/AgendaScreen";
import ClientsScreen from "./src/screens/ClientsScreen";
import PropertiesScreen from "./src/screens/PropertiesScreen";
import MoreScreen from "./src/screens/MoreScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import HotClientsScreen from "./src/screens/HotClientsScreen";
import CorretoresScreen from "./src/screens/CorretoresScreen";
import RelatoriosScreen from "./src/screens/RelatoriosScreen";
import NotificacoesScreen from "./src/screens/NotificacoesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import VisitDetailScreen from "./src/screens/VisitDetailScreen";
import QuizScreen from "./src/screens/QuizScreen";
import NewVisitScreen from "./src/screens/NewVisitScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NovaVisitaButton({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("NewVisit")} style={{ marginRight: 14 }} accessibilityLabel="Nova visita">
      <Text style={{ color: colors.orange, fontWeight: "bold", fontSize: 15 }}>+ Visita</Text>
    </TouchableOpacity>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.graphite },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.graphite,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({ title: "Início", headerRight: () => <NovaVisitaButton navigation={navigation} /> })}
      />
      <Tab.Screen
        name="Visitas"
        component={VisitsScreen}
        options={({ navigation }) => ({ headerRight: () => <NovaVisitaButton navigation={navigation} /> })}
      />
      <Tab.Screen name="Clientes" component={ClientsScreen} />
      <Tab.Screen name="Imóveis" component={PropertiesScreen} />
      <Tab.Screen name="Mais" component={MoreScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: colors.graphite }, headerTintColor: colors.white }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="VisitDetail" component={VisitDetailScreen} options={{ title: "Detalhe da visita" }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Quiz pós-visita" }} />
          <Stack.Screen name="NewVisit" component={NewVisitScreen} options={{ title: "Nova visita" }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
          <Stack.Screen name="Agenda" component={AgendaScreen} options={{ title: "Agenda" }} />
          <Stack.Screen name="Quentes" component={HotClientsScreen} options={{ title: "Clientes Quentes" }} />
          <Stack.Screen name="Corretores" component={CorretoresScreen} options={{ title: "Corretores" }} />
          <Stack.Screen name="Relatorios" component={RelatoriosScreen} options={{ title: "Relatórios" }} />
          <Stack.Screen name="Notificacoes" component={NotificacoesScreen} options={{ title: "Notificações" }} />
          <Stack.Screen name="Perfil" component={ProfileScreen} options={{ title: "Perfil" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Root />
      </NavigationContainer>
    </AuthProvider>
  );
}
