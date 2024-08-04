import { Stack, Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/colors";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        // headerTitle: (props) => <LogoTitle {...props} />,
        headerStyle: {
          backgroundColor: "#611821",
        },
        // headerTintColor: "pink",
        headerTintColor: colors["secT"],
      }}
    >
      <Stack.Screen
        name="SignInScreen"
        options={{
          headerTitle: "Sign In Layout",
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        options={{
          headerTitle: "Register Layout",
        }}
      />
      <Stack.Screen
        name="PasswordRecoveryScreen"
        options={{
          headerTitle: "Password Recovery Layout",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
