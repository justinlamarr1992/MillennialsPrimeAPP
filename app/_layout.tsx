import "react-native-reanimated";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/provider/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import ErrorBoundary from "@/components/ErrorBoundary";

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

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (user && inAuthGroup) {
      // User is signed in but on auth screens, redirect to home
      router.replace("/(tabs)/(home)/HomePage");
    } else if (!user && !inAuthGroup && segments[0] !== undefined) {
      // User is not signed in but trying to access protected routes, redirect to sign in
      router.replace("/(auth)/SignInScreen");
    }
  }, [user, loading, segments]);

  if (loading) {
    // Show loading indicator while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BottomSheetModalProvider>
            <RootLayoutNav />
          </BottomSheetModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
