import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { colors } from "./src/theme";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AgendaScreen from "./src/screens/AgendaScreen";
import HotClientsScreen from "./src/screens/HotClientsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import VisitDetailScreen from "./src/screens/VisitDetailScreen";
import QuizScreen from "./src/screens/QuizScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
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
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Quiz pos-visita" }} />
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
