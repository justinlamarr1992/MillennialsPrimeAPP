import React, { useContext, useState } from "react";
import { Stack } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { AuthContext } from "@/context/AuthContext";

export default function Layout() {
  // const { auth, id, accessToken, roles } = useContext(AuthContext);
  const { admin, prime } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // const [admin, setAdmin] = useState(false);
  // const [prime, setPrime] = useState(true);
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
          backgroundColor: colors["priC"],
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="UserScreen"
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
        name="EComm"
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
