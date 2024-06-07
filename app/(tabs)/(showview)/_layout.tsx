import React from "react";
import { useColorScheme } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Drawer
      screenOptions={{
        drawerActiveBackgroundColor: colors["quiC"],
        drawerActiveTintColor: colors["secC"],
        drawerInactiveTintColor: colors["hexC"],
        drawerPosition: "left",
        drawerStyle: { backgroundColor: colors["secC"] },
      }}
    >
      <Drawer.Screen
        name="ShowViewScreen"
        options={{
          headerTitle: "Episodes",
          drawerLabel: "Episodes",
          drawerIcon: ({ size, color }) => (
            <Ionicons size={28} name="star-half" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PrimeShow"
        options={{
          headerTitle: "Prime Users",
          drawerLabel: "Prime Users",
          drawerIcon: ({ size, color }) => (
            <Ionicons size={28} name="star" color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
