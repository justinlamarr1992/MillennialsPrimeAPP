import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        tabBarStyle: {
          // paddingBottom: insets.bottom,
          paddingBottom: 0,
          // marginTop: -40,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          position: "absolute",
          overflow: "hidden",
          height: 80,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          // fontSize: 12,
          fontWeight: "bold",
          marginBottom: 20,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: true,
          headerTitle: "Home",
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
          // tabBarStyle: { marginBottom: 10 },

          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          headerShown: true,
          headerTitle: "Settings (Next Update)",
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
          title: "Settings (Next Update)",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="cog" color={color} />
          ),
        }}
      />
      {/*
        TODO: Enable these tabs when features are ready for production
        All feature code is implemented in app/(tabs)/(social), app/(tabs)/(upload), and app/(tabs)/(shows)

        These tabs are hidden from the tab bar using href: null
        To enable a tab:
        1. Remove the href: null line
        2. Uncomment the tabBarIcon and title properties
        3. Test thoroughly before deploying
      */}
      <Tabs.Screen
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
          title: "Social",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(upload)"
        options={{
          href: null,
          headerShown: true,
          headerTitle: "Upload",
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
          // title: "Upload",
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="cloud-upload" size={28} color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="(shows)"
        options={{
          href: null,
          headerShown: true,
          headerTitle: "Shows",
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
          // title: "Shows",
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="play-circle" size={28} color={color} />
          // ),
        }}
      />
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
            // shadowColor: colors["background"],
            height: 150,
            // This is what i need to show more of the users in profiles
            // overflow: "hidden",
          },
          title: "Log Out",
          headerTitle: "Log Out",
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
