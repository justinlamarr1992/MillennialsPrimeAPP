import {
  View,
  Text,
  useColorScheme,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  // Image,
} from "@react-navigation/native";
import React, { useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AuthContext } from "@/context/AuthContext";

import homeScreen from "@/app/(tabs)/(home)/homeScreen";

import RegisterScreen from "@/app/(auth)/RegisterScreen";
import SignInScreen from "@/app/(auth)/SignInScreen";
import LogOutScreen from "@/app/(tabs)/LogOutScreen";
import PasswordRecoveryScreen from "@/app/(auth)/PasswordRecoveryScreen";

import MyInfoScreen from "@/app/settings/MyInfoScreen";
import BusinessScreen from "@/app/settings/BusinessScreen";
import ArtScreen from "@/app/settings/ArtScreen";
import AboutScreen from "@/app/(auth)/AboutScreen";

import UserScreen from "@/app/(tabs)/(social)/UserScreen";
import ConnectedUsersScreen from "@/app/(tabs)/(social)/ConnectedUsersScreen";
import MyProfileScreen from "@/app/(tabs)/(social)/MyProfileScreen";

import ShowViewScreen from "@/app/(tabs)/(showview)/ShowViewScreen";
import PrimeShowScreen from "@/app/(tabs)/(showview)/PrimeShow";
import UploadContentScreen from "@/app/(tabs)/(upload)/UploadContentScreen";

import { Logo } from "../../assets/images/MillennialsPrimeLogoNB.png";
import { Colors } from "../../constants/colors";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useTheme } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppNav = () => {
  const {
    login,
    logout,
    auth,
    setAuth,
    isLoading,
    accessToken,
    id,
    userInfo,
    roles,
  } = useContext(AuthContext);
  const theme = useColorScheme();

  if (isLoading) {
    return (
      // utilize dark and light here
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  const authCheck = () => {
    if (auth !== null) {
      return <TabNavigator />;
    } else {
      return <AuthStack />;
    }
  };

  return authCheck();

  // <NavigationContainer>
  //   {auth !== null ? <TabNavigator /> : <AuthStack />}
  // </NavigationContainer>
};

function LogoTitle() {
  return <Image style={{ width: 44, height: 40 }} source={Logo} />;
}
function TabNavigator() {
  const colors1 = useTheme().colors;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "EpisodesTab") {
            iconName = focused ? "play-circle" : "play-circle-outline";
          } else if (route.name === "LogOutTab") {
            iconName = focused ? "log-out" : "log-out-outline";
          } else if (route.name === "SettingsTab") {
            iconName = focused ? "cog" : "cog-outline";
          } else if (route.name === "UploadTab") {
            iconName = focused ? "star" : "star-half-outline";
          } else if (route.name === "UsersTab") {
            iconName = focused ? "people-circle" : "people-circle-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors1.actTabText,
        tabBarActiveBackgroundColor: colors1.inActTab,
        tabBarInactiveTintColor: colors1.inActTabText,
        tabBarInactiveBackgroundColor: colors1.inActTab,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={StackNavigator}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
      {/* Finding out how to put his as a button from homw */}
      {/* <Tab.Screen
        // LATER will be a page to pick what to change (info, business, art) but for now settings
        name="Settings"
        component={SettingsStack}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      /> */}
      <Tab.Screen
        // LATER will be a page to pick what to change (info, business, art) but for now settings
        name="UsersTab"
        component={UsersStack}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
      <Tab.Screen
        name="UploadTab"
        component={UploadStack}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
      <Tab.Screen
        name="EpisodesTab"
        component={ShowViewStack}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
      <Tab.Screen
        name="LogOutTab"
        component={LogOutScreen}
        options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  const colors1 = useTheme().colors;

  return (
    <Stack.Navigator
      //   Default header for pages not speified
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fffd9b",
        },
        headerShown: false,
        headerTintColor: "#020101",
      }}
    >
      {/* Home Stack Navigator */}
      {/* <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
            height: 200,
            width: 10,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          },
          headerTintColor: "#ffffff",
        }}
      /> */}
      <Stack.Screen
        name="Home"
        component={homeScreen}
        options={{
          headerRight: () => (
            <Button
              onPress={() => alert("This is a button!")}
              title="Info"
              color="#fff"
            />
          ),
        }}
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
    </Stack.Navigator>
  );
}
function UsersStack() {
  const colors1 = useTheme().colors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fffd9b",
        },
        headerShown: false,
        headerTintColor: "#020101",
      }}
    >
      <Stack.Screen
        name="User Stack"
        component={UserScreen}
        options={{
          title: "(User Name HERE)",
          // headerStyle: {
          //   backgroundColor: "#8e202b",
          // },
          // headerTintColor: "#ffffff",
          // // headerBackground:,
          // hideWhenScrolling: true,
        }}
      />
      <Stack.Screen
        name="Connected Users"
        component={ConnectedUsersScreen}
        options={{
          title: "Connected Users",
          // headerStyle: {
          //   backgroundColor: "#8e202b",
          // },
          // headerTintColor: "#ffffff",
          // // headerBackground:,
          // hideWhenScrolling: true,
        }}
      />
      <Stack.Screen
        name="My Profile"
        component={MyProfileScreen}
        options={{
          title: "My Profile",
          // headerStyle: {
          //   backgroundColor: "#8e202b",
          // },
          // headerTintColor: "#ffffff",
          // // headerBackground:,
          // hideWhenScrolling: true,
        }}
      />
    </Stack.Navigator>
  );
}
function SettingsStack() {
  const colors1 = useTheme().colors;

  return (
    <Stack.Navigator
      //   Default header for pages not speified
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fffd9b",
        },
        headerShown: false,
        headerTintColor: "#020101",
      }}
    >
      {/* <Stack.Screen
        name="About"
        component={AboutScreen}
        // options={{
        //   title: "It Should Work",
        //   headerStyle: {
        //     backgroundColor: "#8e202b",
        //   },
        //   headerTintColor: "#ffffff",
        //   // headerBackground:,
        //   hideWhenScrolling: true,
        // }}
      /> */}
      <Stack.Screen
        name="My Info"
        component={MyInfoScreen}
        // options={{
        //   title: "I Hope this is it",
        //   headerStyle: {
        //     backgroundColor: "#8e202b",
        //   },
        //   headerTintColor: "#ffffff",
        //   // headerBackground:,
        //   hideWhenScrolling: true,
        // }}
      />
      <Stack.Screen
        name="Business"
        component={BusinessScreen}
        // options={{
        //   title: "I Hope this is it",
        //   headerStyle: {
        //     backgroundColor: "#8e202b",
        //   },
        //   headerTintColor: "#ffffff",
        //   // headerBackground:,
        //   hideWhenScrolling: true,
        // }}
      />
      <Stack.Screen
        name="Art"
        component={ArtScreen}
        // options={{
        //   title: "I Hope this is it",
        //   headerStyle: {
        //     backgroundColor: "#8e202b",
        //   },
        //   headerTintColor: "#ffffff",
        //   // headerBackground:,
        //   hideWhenScrolling: true,
        // }}
      />
    </Stack.Navigator>
  );
}
function UploadStack() {
  const colors1 = useTheme().colors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fffd9b",
        },
        headerShown: false,
        headerTintColor: "#020101",
      }}
    >
      <Stack.Screen
        name="Upload"
        component={UploadContentScreen}
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
    </Stack.Navigator>
  );
}
function ShowViewStack() {
  const colors1 = useTheme().colors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fffd9b",
        },
        headerShown: false,
        headerTintColor: "#020101",
      }}
    >
      <Stack.Screen
        name="Episodes"
        component={ShowViewScreen}
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

      <Stack.Screen
        name="PrimeShow"
        component={PrimeShowScreen}
        // options={{
        //   title: "I Hope this is it",
        //   headerStyle: {
        //     backgroundColor: "#8e202b",
        //   },
        //   headerTintColor: "#ffffff",
        //   // headerBackground:,
        //   hideWhenScrolling: true,
        // }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  const colors1 = useTheme().colors;

  return (
    <Stack.Navigator
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
    </Stack.Navigator>
  );
}

export default AppNav;
