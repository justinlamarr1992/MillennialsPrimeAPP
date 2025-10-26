import React from "react";
import { Stack } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["priC"],
          // borderBottomLeftRadius: 32, // Not supported in headerStyle
          // borderBottomRightRadius: 32, // Not supported in headerStyle
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
