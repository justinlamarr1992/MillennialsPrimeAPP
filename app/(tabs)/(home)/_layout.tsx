import React from "react";
import { Stack } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        // headerLeft: () => (
        //   <Ionicons size={28} name="search" color={colors["hexC"]} />
        // ),
        headerRight: () => (
          <Ionicons size={28} name="ellipsis-vertical" color={colors["quaC"]} />
        ),
        headerStyle: {
          backgroundColor: colors["priC"],
          // borderBottomLeftRadius: 32,
          // borderBottomRightRadius: 32,
          // shadowColor: colors["background"],
          // height: 200, This is what i need to show more of the users in profiles
          // overflow: "hidden",
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
