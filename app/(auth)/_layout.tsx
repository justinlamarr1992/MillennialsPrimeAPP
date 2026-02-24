import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors["priC"],
        },
        headerTintColor: colors["secT"],
      }}
    >
      <Stack.Screen name="SignInScreen" options={{ headerTitle: "Sign In" }} />
      <Stack.Screen name="RegisterScreen" options={{ headerTitle: "Register" }} />
      <Stack.Screen name="PasswordRecoveryScreen" options={{ headerTitle: "Password Recovery" }} />
    </Stack>
  );
};

export default RootLayout;
