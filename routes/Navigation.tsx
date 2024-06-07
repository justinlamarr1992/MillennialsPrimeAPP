import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
// import AppNav from "./navigation/AppNav";
import { useColorScheme } from "react-native";

export default function Navigation() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

//  <Stack>
//    <Stack.Screen name="index" />
//  </Stack>;

function AuthStack() {}
