import React, { useState } from "react";
import {
  Text,
  View,
  useColorScheme,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { handleAuthError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";
import { serverAuth } from "@/services/serverAuth";

export default function LogOutScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    setErrMsg("");

    try {
      // Step 1: Sign out from Firebase
      logger.log('🔓 Signing out from Firebase...');
      await auth().signOut();
      logger.log('✅ Firebase sign-out successful');

      // Step 2: Clear MongoDB server credentials
      logger.log('🔓 Clearing MongoDB server credentials...');
      await serverAuth.logout();
      logger.log('✅ MongoDB credentials cleared');
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
      const errorMessage = handleAuthError(firebaseError);
      setErrMsg(errorMessage);
      logger.error('❌ Sign out error:', firebaseError.code, firebaseError.message);
      setLoading(false);
      return; // Exit early on error
    }

    // Only navigate if sign out was successful
    setLoading(false);
    router.replace("/(auth)/SignInScreen");
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
      {errMsg && (
        <Text style={[globalStyles.errorText, { color: colors["secC"], marginBottom: 16 }]}>
          {errMsg}
        </Text>
      )}
      {loading ? (
        <ActivityIndicator size={"small"} style={{ margin: 28 }} />
      ) : (
        <Pressable
          style={[globalStyles.button, { backgroundColor: colors["priC"] }]}
          onPress={handleLogOut}
        >
          <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
            Log Out
          </Text>
        </Pressable>
      )}
    </View>
  );
}
