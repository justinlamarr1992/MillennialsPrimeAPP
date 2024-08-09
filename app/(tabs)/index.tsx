import React, { useContext, useEffect, useRef, useMemo } from "react";
import { Appearance, useColorScheme, StyleSheet, Text } from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { AuthContext } from "@/context/AuthContext";
import AppNav from "@/routes/navigation/AppNav";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { globalStyles } from "@/constants/global";
import CommentModal from "@/shared/Modals/CommentModal";

// TODO Mak this the Loading page for The APP

export default function Index() {
  return (
    <BottomSheetModalProvider>
      <SafeAreaProvider>
        {/* <AuthProvider> */}
        <AppNav />
        {/* <Text>Testing</Text> */}
        {/* </AuthProvider> */}
      </SafeAreaProvider>
    </BottomSheetModalProvider>
  );
}
