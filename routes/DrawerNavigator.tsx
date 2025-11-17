import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "../src/BottomTab/Home";
import About from "../src/Stack/About";
import { StyleSheet } from "react-native-web";

import { Image } from "react-native";
import Logo from "../assets/images/MillennialsPrimeLogoNB.png";

export default function DrawerNavigation() {
  const Drawer = createDrawerNavigator();

  function LogoTitle() {
    return <Image style={{ width: 44, height: 40 }} source={Logo} />;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: "#611821" },
        drawerType: "back",
        drawerActiveTintColor: "#fffd9b",
        drawerActiveBackgroundColor: "#BD2932",
        drawerInactiveTintColor: "#b9a054",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        style={styles.drawer}
        // Connected from custom Header
        // options={({ navigation }) => {
        //   return {
        //     headerTitle: () => (
        //       <Header navigation={navigation} title="Home Page" />
        //     ),
        //   };
        // }}
        // Better looking way
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: "#611821",
          },
          headerTintColor: "#ffffff",
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          headerStyle: {
            backgroundColor: "#8e202b",
          },
          headerTintColor: "#ffffff",
        }}
        // options={({ navigation }) => {
        //   return {
        //     headerTitle: () => (
        //       <Header navigation={navigation} title="About Page" />
        //     ),
        //   };
        // }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: "100%",
    // height: "100%",
    // backgroundColor: "#611821",
    backgroundColor: "orange",
  },
});
