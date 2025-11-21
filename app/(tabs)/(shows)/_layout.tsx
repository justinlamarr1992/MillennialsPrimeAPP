import React from "react";
import { useColorScheme } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/Colors";
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
      {/* <Drawer.Screen
        name="ShowViewScreen"
        options={{
          headerTitle: "Episodes",
          drawerLabel: "Episodes",
          drawerIcon: ({ color }) => (
            <Ionicons size={28} name="star-half" color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="PrimeShow"
        options={{
          headerTitle: "Prime Users",
          drawerLabel: "Prime Users",
          drawerIcon: ({ color }) => (
            <Ionicons size={28} name="star" color={color} />
          ),
        }}
      />
      <Stack.Screen
        name="ShowViewScreen"
        options={{
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
      />
      {/* Add custom stuff for the pages here */}
      {/* cog on side for settings */}
    </Drawer>
  );
}
