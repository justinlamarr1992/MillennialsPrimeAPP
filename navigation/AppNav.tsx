// import { Stack } from "expo-router";
// import React, { useEffect, useContext } from "react";
// import { AuthContext } from "@/context/AuthContext";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useColorScheme, Button } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { COLORS } from "@/constants/Colors";
// import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// SplashScreen.preventAutoHideAsync();

// export default function AppNav() {
//   const colorScheme = useColorScheme();
//   const colors = COLORS[colorScheme ?? "dark"];

//   const [loaded] = useFonts({
//     "inter-regular": require("../assets/fonts/Inter-Regular.ttf"),
//     "inter-bold": require("../assets/fonts/Inter-Bold.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }
//   if (isLoading) {
//     return (
//       // utilize dark and light here
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size={"large"} />
//       </View>
//     );
//   }

//   return (
//     <Stack
//       theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: colors["priC"],
//         },
//         headerTintColor: "orange",
//         headerTitleStyle: {
//           fontWeight: "bold",
//         },
//         // headerRight: () => (
//         //   <Ionicons size={28} name="ellipsis-vertical" color={colors["hexC"]} />
//         //   // <Button
//         //   //   onPress={() => alert("This is a button!")}
//         //   //   title="Info"
//         //   //   color="#fff"
//         //   // />
//         // ),
//         // headerTitle: (props) => <LogoTitle {...props} />,
//       }}
//     >
//       {/* <Stack.Screen
//         name="(home)"
//         options={{
//           title: "Da Home",
//         }}
//       /> */}
//       <Stack.Screen
//         name="(tabs)"
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen name="modal" options={{ presentation: "modal" }} />
//     </Stack>
//   );
// }
