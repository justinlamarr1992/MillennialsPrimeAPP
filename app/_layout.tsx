import "react-native-reanimated";
import React, { useEffect, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/provider/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { View, ActivityIndicator, LogBox } from "react-native";
import ErrorBoundary from "@/components/ErrorBoundary";
import Toast from "react-native-toast-message";

// Suppress RNFB namespaced API deprecation toasts — migration to v22 modular API is tracked separately
LogBox.ignoreLogs([
  "This method is deprecated (as well as all React Native Firebase namespaced API)",
]);

// Create a QueryClient instance for data fetching and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on window focus (not applicable for mobile)
      refetchOnReconnect: true, // Refetch when reconnecting to network
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function getRedirectTarget(
  user: FirebaseAuthTypes.User | null,
  segments: string[]
): "/(tabs)/(home)/HomePage" | "/" | null {
  // Authenticated user on index or auth group → send to home
  if (user && (segments[0] === undefined || segments[0] === "(auth)")) {
    return "/(tabs)/(home)/HomePage";
  }
  // Unauthenticated user somehow on a protected route → send to index (login form)
  if (!user && segments[0] !== undefined && segments[0] !== "(auth)") {
    return "/";
  }
  return null;
}

export function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Keep segments in a ref so the effect always reads the latest value without
  // re-running on every intermediate segment change during navigation transitions.
  // Re-running mid-transition can dispatch multiple router.replace calls that
  // corrupt React Navigation state and land on the wrong screen.
  const segmentsRef = useRef<string[]>([]);
  segmentsRef.current = segments as string[];

  useEffect(() => {
    if (loading) return;
    const target = getRedirectTarget(user, segmentsRef.current);
    if (target) router.replace(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);

  if (loading || (!!user && segments[0] === undefined)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }

  return (
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
  );
}

export default function RootLayout() {
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
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BottomSheetModalProvider>
              <RootLayoutNav />
            </BottomSheetModalProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
      <Toast />
    </>
  );
}
