import React, { useContext, useState } from "react";
import { Text, View, Button, useColorScheme, Pressable } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "expo-router";

export default function LogOutScreen() {
  const { logout, isLoading } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const navigation = useNavigation();
  // const colors = useTheme().colors;
  const [errMsg, setErrMsg] = useState("");

  const handleLogOut = async () => {
    try {
      logout();
      // isLoading(true);
      // console.log("Finushed Signing Out");
    } catch (err) {
      console.log("ERR===>", err);
      if (!err?.originalStatus) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.originalStatus === 400) {
        setErrMsg("Missing Info");
      } else if (err.originalStatus === 401) {
        setErrMsg("Unauthorized but its here");
      } else if (err.originalStatus === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Login Failed");
      }
    } finally {
      // isLoading(false);
      // console.log("Finally");
      // navigation.navigate("/../(auth)/SignInScreen");
    }
  };

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
        <Text style={globalStyles.buttonText} onPress={handleLogOut}>
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
