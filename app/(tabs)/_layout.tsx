import { Tabs } from "expo-router";
import { useColorScheme, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

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
          headerShown: true,
          headerTitle: "Home ",
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
          },
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
          },
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cog" color={color} />
          ),
        }}
      />
      {/* TODO: ADD THESE WITH LATER UPDATES THEY ARE IN THE TABSLATER FOLDER */}
      {/* <Tabs.Screen
        name="(social)"
        options={{
          headerShown: true,
          headerTitle: "Social",
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
          },
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Users",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="(upload)"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
          },
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Upload",
          headerTitle: "Tabs Layout",
          tabBarIcon: ({ color }) => (
            <Ionicons name="star" size={28} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="(showview)"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
          },
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Episodes",
          headerTitle: "Tabs Layout",
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle" size={28} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="LogOutScreen"
        options={{
          // headerRight
          // headerShadowVisible: {},
          headerTintColor: colors["secT"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: colors["priC"],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: colors["background"],
            height: 150,
            // This is what i need to show more of the users in profiles
            // overflow: "hidden",
          },
          title: "Log Out",
          headerTitle: "Tabs Layout",
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
