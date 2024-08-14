import "react-native-reanimated";
import React, { useContext, useEffect, useState } from "react";
import { Stack, Slot, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/provider/AuthProvider";
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

// import { DarkTheme, DefaultTheme } from "@react-navigation/native";
// import AppNav from "@/navigation/AppNav";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// TODO: If the navigation does work change this to simple and AppNav to simple and utilize index to do the determination if auth is present

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // const [initializing, setInitializing] = useState(true);
  // // const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  // const router = useRouter();
  // const segments = useSegments();

  const [loaded] = useFonts({
    "inter-regular": require("../assets/fonts/Inter-Regular.ttf"),
    "inter-bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  // const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
  //   console.log("onAuthStateChanged", user);
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // };

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber;
  // }, []);

  // useEffect(() => {
  //   if (initializing) return;

  //   const inAuthGroup = segments[0] === "(auth)";

  //   if (user && !inAuthGroup) {
  //     router.replace("/home/");
  //   } else if (!user && inAuthGroup) {
  //     router.replace("/");
  //   }
  // });

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
      {/* <AuthProvider>
        {auth == null || auth == false || !auth || auth == undefined ? ( */}
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
      {/*           
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}
      </AuthProvider> */}
    </BottomSheetModalProvider>
  );
}
