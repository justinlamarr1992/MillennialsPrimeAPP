import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["priC"],
        },
        headerTintColor: colors["secT"],
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" />
      <Stack.Screen name="MyInfoScreen" />
      <Stack.Screen name="BusinessScreen" />
      <Stack.Screen name="ArtScreen" />
    </Stack>
  );
}
