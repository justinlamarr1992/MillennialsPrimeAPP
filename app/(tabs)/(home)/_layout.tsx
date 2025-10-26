import React from "react";
import { Stack } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeLayout() {
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
          // borderBottomLeftRadius: 32, // Not supported in headerStyle
          // borderBottomRightRadius: 32, // Not supported in headerStyle
          // shadowColor: colors["background"], // Not supported in headerStyle
          // height: 200, This is what i need to show more of the users in profiles
          // overflow: "hidden", // Not supported in headerStyle
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      {/* Add custom stuff for the pages here */}
      {/* cog on side for settings */}
    </Stack>
  );
}
