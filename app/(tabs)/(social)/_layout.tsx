import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function Layout() {
  // const { auth, id, accessToken, roles } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // NOTE: Intentional hardcoded values. AuthContext only contains { user, loading }.
  // Admin/prime status will be derived from user data structure when available.
  const admin = false;
  const prime = false;
  const userColor = admin
    ? colors["quaC"]
    : prime
    ? colors["secC"]
    : colors["regC"];
  const userColorText = admin ? "#020101" : prime ? "#ffffff" : "#020101";
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["backgroundColor"],
        },
        headerTintColor: colors["text"],
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Social",
          headerStyle: {
            backgroundColor: colors["priC"],
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EComm"
        options={{
          headerStyle: {
            backgroundColor: colors["backgroundColor"],
            // backgroundColor: colors["priC"],
            // borderBottomLeftRadius: 32,
            // borderBottomRightRadius: 32,
            // shadowColor: colors["background"],
            // height: 200,
            // overflow: "hidden",
          },
          headerTintColor: userColorText,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerStyle: {
            backgroundColor: colors["priC"],
            // borderBottomLeftRadius: 32,
            // borderBottomRightRadius: 32,
            // shadowColor: colors["background"],
            // height: 200,
            // overflow: "hidden",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="MyProfileScreen"
        options={{
          // Note: headerShown: true here creates a second header with back button
          // This is intentional to enable navigation back to Social feed
          // The Tabs navigator also shows a header for Social tab
          headerShown: true,
          title: "My Profile",
          headerStyle: {
            backgroundColor: userColor,
          },
          headerTintColor: userColorText,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        options={{
          headerShown: false,
          title: "Edit Profile",
        }}
      />
      {/* Add custom stuff for the pages here */}
      {/* cog on side for settings */}
    </Stack>
  );
}
