import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["priC"],
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Add custom stuff for the pages here */}
      {/* cog on side for settings */}
    </Stack>
  );
}
