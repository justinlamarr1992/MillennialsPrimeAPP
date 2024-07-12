import React, { useContext, useEffect } from "react";
import { Appearance, useColorScheme, StyleSheet, Text } from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { AuthContext } from "@/context/AuthContext";
import AppNav from "@/routes/navigation/AppNav";
// import { useTheme } from "@react-navigation/native";
// TODO Mak this the Loading page for The APP

export default function Index() {
  return (
    <SafeAreaProvider>
      {/* <AuthProvider> */}
      <AppNav />
      {/* <Text>Testing</Text> */}
      {/* </AuthProvider> */}
    </SafeAreaProvider>
  );
}
