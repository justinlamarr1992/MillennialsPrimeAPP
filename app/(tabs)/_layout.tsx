import { Tabs } from "expo-router";
import { useColorScheme, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors["quaC"],
        tabBarActiveBackgroundColor: colors["triC"],
        tabBarInactiveTintColor: colors["hexC"],
        tabBarInactiveBackgroundColor: colors["priC"],
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          headerTitle: "Home",
          headerStyle: {
            backgroundColor: "pink",
          },
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="(social)"
        options={{
          headerShown: false,
          title: "Users",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(upload)"
        options={{
          headerShown: false,
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <Ionicons name="star" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(showview)"
        options={{
          headerShown: false,
          title: "Episodes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="LogOutScreen"
        options={{
          // headerRight
          // headerShadowVisible: {},
          headerTintColor: colors["secT"],
          headerTitleStyle: { color: "#fff" },
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            // height: 200, This is what i need to show more of the users in profiles
            // overflow: "hidden",
          },
          title: "Log Out",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out" size={28} color={color} />
          ),
        }}
      />
      {/* screenOptions=
      {{
        headerStyle: {
          backgroundColor: colors["priC"],
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }} */}
    </Tabs>
  );
};

export default TabsLayout;
