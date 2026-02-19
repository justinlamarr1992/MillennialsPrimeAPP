import React from "react";
import { Pressable, Text, useColorScheme } from "react-native";
import { router } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";

type NestedState = {
  index?: number;
  routes?: { name: string }[];
};

type TabState = {
  index: number;
  routes: { name: string; state?: unknown }[];
};

const ROUTE_TITLES: Record<string, string> = {
  MyProfileScreen: "My Profile",
  ConnectedUsersScreen: "Connections",
  EditProfileScreen: "Edit Profile",
  "[id]": "Profile",
  Settings: "Settings",
  MyInfoScreen: "My Info",
  BusinessScreen: "Business",
  ArtScreen: "Art",
};

const TAB_ROOT_TITLES: Record<string, string> = {
  "(social)": "Social",
  "(settings)": "Settings",
};

export function getBackLabel(state: TabState | null): string | null {
  if (!state) return null;
  const focusedRoute = state.routes[state.index];
  const nestedState = focusedRoute?.state as NestedState | undefined;
  const nestedIndex = nestedState?.index ?? 0;
  if (!nestedState?.routes || nestedIndex === 0) return null;
  const previousRoute = nestedState.routes[nestedIndex - 1];
  if (previousRoute.name === "index") {
    return TAB_ROOT_TITLES[focusedRoute.name] ?? focusedRoute.name;
  }
  return ROUTE_TITLES[previousRoute.name] ?? previousRoute.name;
}

export function TabBackButton() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const backLabel = useNavigationState(
    (state): string | null => getBackLabel(state as TabState | null)
  );

  if (!backLabel) return null;

  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel={`Go back to ${backLabel}`}
      accessibilityHint="Navigate to the previous screen"
      style={globalStyles.tabBackButton}
    >
      <Ionicons name="arrow-back" size={22} color={colors.secT} />
      <Text style={[globalStyles.tabBackButtonLabel, { color: colors.secT }]}>
        {backLabel}
      </Text>
    </Pressable>
  );
}
