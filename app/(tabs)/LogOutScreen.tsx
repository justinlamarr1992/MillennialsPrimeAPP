import React, { useContext, useState } from "react";
import {
  Text,
  View,
  Button,
  useColorScheme,
  Pressable,
  ActivityIndicator,
} from "react-native";
// import { useNavigation, useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

export default function LogOutScreen() {
  // const { logout, setIsLoading } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  // const navigation = useNavigation();
  // const colors = useTheme().colors;
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleLogOut = async () => {
    setLoading(true);

    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
    // setIsLoading(true);
    // logout();
    // auth().signOut();
    router.push("/(auth)/SignInScreen");

    setLoading(false);
  };

  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.centerItem,
        globalStyles.logouttry,
        globalStyles.padding,
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
        Come Back Soon, There's More to Come
      </Text>
      {loading ? (
        <ActivityIndicator size={"small"} style={{ margin: 28 }} />
      ) : (
        <Pressable
          // onPress={logout}
          style={[globalStyles.button, { backgroundColor: colors["priC"] }]}
        >
          <Text
            style={[globalStyles.buttonText, { color: colors["secT"] }]}
            onPress={handleLogOut}
          >
            Log Out
          </Text>
        </Pressable>
      )}
    </View>
  );
}
