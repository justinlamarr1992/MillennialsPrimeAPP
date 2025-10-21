import "react-native-reanimated";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/provider/AuthProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

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
    <AuthProvider>
      <BottomSheetModalProvider>
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
    </AuthProvider>
  );
}
