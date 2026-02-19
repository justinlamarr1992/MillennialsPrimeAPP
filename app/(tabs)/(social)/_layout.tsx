import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export default function Layout() {
  // const { auth, id, accessToken, roles } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
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
          headerTintColor: colors["text"],
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
          headerShown: false,
          title: "My Profile",
        }}
      />
      <Stack.Screen
        name="ConnectedUsersScreen"
        options={{
          headerShown: false,
          title: "Connections",
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
