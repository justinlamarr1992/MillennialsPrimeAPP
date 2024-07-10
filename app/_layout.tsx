import "react-native-reanimated";
import React, { useContext } from "react";
import { Stack, useNavigation } from "expo-router";
// import { Appearance, useColorScheme } from "react-native";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { AuthContext } from "@/context/AuthContext";

import { COLORS } from "@/constants/colors";
// import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import AppNav from "@/navigation/AppNav";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// TODO: If the navigation does work change this to simple and AppNav to simple and utilize index to do the determination if auth is present

export default function RootLayout() {
  // const auth = null;
  const { auth } = useContext(AuthContext);
  console.log(auth);
  if (auth) {
    console.log("The Auth from AppNav is ", auth);
  } else {
    console.log("No Auth in AppNav");
  }
  // const colorScheme = useColorScheme();
  // const colors = COLORS[colorScheme ?? "dark"];

  // const [loaded] = useFonts({
  //   "inter-regular": require("../assets/fonts/Inter-Regular.ttf"),
  //   "inter-bold": require("../assets/fonts/Inter-Bold.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {auth == null ? (
          <AppNav />
        ) : (
          <Stack>
            <Stack.Screen
              name="(auth)"
              // options={{
              //   headerRight: () => (
              //     <Button
              //       onPress={() => alert("This is a button!")}
              //       title="Info"
              //       color="#fff"
              //     />
              //   ),
              // }}
              // options={({ navigation }) => {
              //   return {
              //     headerTitle: () => (
              //       <Header
              //         navigation={navigation}
              //         title="Welcome to Millennial's Prime"
              //       />
              //     ),
              //   };
              // }}
            />
          </Stack>
        )}
      </AuthProvider>
    </SafeAreaProvider>

    // Was inbetween authprovider

    //   <Stack
    //     theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    //     screenOptions={{
    //       headerStyle: {
    //         backgroundColor: colors["priC"],
    //       },
    //       headerTintColor: "#fff",
    //       headerTitleStyle: {
    //         fontWeight: "bold",
    //       },
    //       // headerTitle: (props) => <LogoTitle {...props} />,
    //     }}
    //   >
    //     {/* <Stack.Screen
    //   name="(home)"
    //   options={{
    //     title: "Da Home",
    //   }}
    // /> */}
    //     <Stack.Screen
    //       name="(tabs)"
    //       options={{
    //         headerShown: false,
    //       }}
    //     />
    //     <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    //   </Stack>

    // Works but no functionality
    // return (
    //   <AuthProvider>
    //     <Stack
    //       screenOptions={{
    //         headerStyle: {
    //           backgroundColor: "#8e202b",
    //         },
    //         headerTintColor: "#fff",
    //         headerTitleStyle: {
    //           fontWeight: "bold",
    //         },
    //         // headerTitle: (props) => <LogoTitle {...props} />,
    //       }}
    //     >
    //       <Stack.Screen
    //         name="(tabs)"
    //         options={{
    //           headerShown: false,
    //         }}
    //       />
    //       {/* <Stack.Screen name="index" /> */}
    //     </Stack>
    //   </AuthProvider>
    // );
    // Testing to go eith auth or signed in
    // <AuthProvider>
    //   {test == true ? <StackNavigator /> : <AuthStack />}
    //   {/* {auth !== null ? <TabNavigator /> : <AuthStack />} */}
    // </AuthProvider>
  );
}

// function AuthStack() {
//   // const colors1 = useTheme().colors;

//   return (
//     <Stack
//       screenOptions={{
//         // headerTitle: (props) => <LogoTitle {...props} />,
//         headerStyle: {
//           backgroundColor: "#611821",
//         },
//         // headerTintColor: colors1.text,
//       }}
//     >
//       {/* <Stack.Screen name='Onboarding' component={}/> HAVENT MADE ON BOARDING SCREEN YET*/}
//       <Stack.Screen name="Sign In" component={SignInScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen
//         name="Password Recovery"
//         component={PasswordRecoveryScreen}
//       />
//     </Stack>
//   );
// }

// function StackNavigator() {
//   // const colors1 = useTheme().colors;

//   return (
//     <Stack
//       //   Default header for pages not speified
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: "#fffd9b",
//         },
//         headerShown: false,
//         headerTintColor: "#020101",
//       }}
//     >
//       {/* Home Stack Navigator */}
//       {/* <Stack.Screen
//         name="Home"
//         component={Home}
//         options={{
//           headerTitle: (props) => <LogoTitle {...props} />,
//           headerStyle: {
//             backgroundColor: "#611821",
//             height: 200,
//             width: 10,
//             borderBottomRightRadius: 20,
//             borderBottomLeftRadius: 20,
//           },
//           headerTintColor: "#ffffff",
//         }}
//       /> */}
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           headerRight: () => (
//             <Button
//               onPress={() => alert("This is a button!")}
//               title="Info"
//               color="#fff"
//             />
//           ),
//         }}
//         // options={({ navigation }) => {
//         //   return {
//         //     headerTitle: () => (
//         //       <Header
//         //         navigation={navigation}
//         //         title="Welcome to Millennial's Prime"
//         //       />
//         //     ),
//         //   };
//         // }}
//       />
//     </Stack>
//   );
// }
function AuthStack() {
  const colors1 = useTheme().colors;

  return (
    <Stack
      screenOptions={{
        // headerTitle: (props) => <LogoTitle {...props} />,
        headerStyle: {
          backgroundColor: "#611821",
        },
        headerTintColor: colors1.text,
      }}
    >
      {/* <Stack.Screen name='Onboarding' component={}/> HAVENT MADE ON BOARDING SCREEN YET*/}
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Password Recovery"
        component={PasswordRecoveryScreen}
      />
    </Stack>
  );
}
