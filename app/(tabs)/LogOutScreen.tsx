import React, { useContext } from "react";
import { Text, View, Button, useColorScheme, Pressable } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "expo-router";

export default function LogOutScreen() {
  const { logout } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // const navigation = useNavigation();
  // const colors = useTheme().colors;

  // const handleLogOut = async () => {
  //   try {
  //   } catch (err) {}
  // };

  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.centerItem,
        globalStyles.logouttry,
        { backgroundColor: colors["background"] },
      ]}
    >
      <Text
        style={[
          globalStyles.textHuge,
          globalStyles.padding,
          { color: colors["priT"] },
        ]}
      >
        See Ya
      </Text>
      <Pressable
        onPress={logout}
        style={[globalStyles.button, { backgroundColor: colors["priC"] }]}
      >
        <Text style={globalStyles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}
