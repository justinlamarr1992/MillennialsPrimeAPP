import { Stack } from "expo-router";
import React, { useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/colors";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function AppNav() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const [loaded] = useFonts({
    "inter-regular": require("../assets/fonts/Inter-Regular.ttf"),
    "inter-bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["priC"],
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // headerTitle: (props) => <LogoTitle {...props} />,
      }}
    >
      {/* <Stack.Screen
        name="(home)"
        options={{
          title: "Da Home",
        }}
      /> */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
