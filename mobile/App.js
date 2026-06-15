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
import AgendaScreen from "./src/screens/AgendaScreen";
import ClientsScreen from "./src/screens/ClientsScreen";
import HotClientsScreen from "./src/screens/HotClientsScreen";
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
        name="Agenda"
        component={AgendaScreen}
        options={({ navigation }) => ({ headerRight: () => <NovaVisitaButton navigation={navigation} /> })}
      />
      <Tab.Screen name="Clientes" component={ClientsScreen} />
      <Tab.Screen name="Quentes" component={HotClientsScreen} options={{ title: "Quentes" }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
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
      screenOptions={{
        headerStyle: { backgroundColor: colors.graphite },
        headerTintColor: colors.white,
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="VisitDetail" component={VisitDetailScreen} options={{ title: "Detalhe da visita" }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Quiz pós-visita" }} />
          <Stack.Screen name="NewVisit" component={NewVisitScreen} options={{ title: "Nova visita" }} />
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
