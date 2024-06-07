import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="SignInScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="PasswordRecoveryScreen" />
    </Stack>
  );
};

export default RootLayout;
