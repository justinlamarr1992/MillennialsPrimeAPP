import "react-native-reanimated";
import React, { useContext, useEffect } from "react";
import { Stack, Slot } from "expo-router";
// import { Appearance, useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "@/context/AuthContext";
// import { AuthContext } from "@/context/AuthContext";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/provider/AuthProvider";

// import { DarkTheme, DefaultTheme } from "@react-navigation/native";
// import AppNav from "@/navigation/AppNav";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// TODO: If the navigation does work change this to simple and AppNav to simple and utilize index to do the determination if auth is present

export default function RootLayout() {
  // const auth = null;
  // const { auth } = useContext(AuthContext);
  // console.log("App Layout fires at ", new Date(Date.now()).toString());
  // console.log("App Layout fires at ", Date.now());
  // console.log(auth);
  // if (auth == false) {
  //   console.log("Auth is false");
  // } else if (auth == undefined) {
  //   console.log("Auth is Undefined");
  // } else if (auth == null) {
  //   console.log("Auth is Null");
  // } else if (!auth) {
  //   console.log("Theres No Auth");
  // } else {
  //   ("There is a Auth");
  // }
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
    <BottomSheetModalProvider>
      <AuthProvider>
        {auth == null || auth == false || !auth || auth == undefined ? (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                headerStyle: {},
              }}
            />
          </Stack>
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}
      </AuthProvider>
    </BottomSheetModalProvider>
  );
}
