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
          headerStyle: {
            backgroundColor: userColor,
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
      {/* Add custom stuff for the pages here */}
      {/* cog on side for settings */}
    </Stack>
  );
}
