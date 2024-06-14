import React, { useState } from "react";
import { View, Text, useColorScheme, Pressable } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import ConnectedUserInfo from "./ConnectedUserInfo";
import { Ionicons } from "@expo/vector-icons";

export default function User({ name, industry, connected, matching }) {
  const [bConnected, setBConnected] = useState(connected);
  let prime = false;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const onPressFun = () => {
    console.log("Pressed");
    // TODO: Insert code to make connection in backend to change
    setBConnected(!bConnected);
  };

  return (
    <LinearGradient
      style={globalStyles.postConnectedUser}
      colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
      // THREE LEVELS OF COLORS, ADMIN, PRIME AND REGULAR
    >
      <ConnectedUserInfo
        name={name}
        industry={industry}
        prime={prime}
        connected={true}
        matching={matching}
      />
      {/* MAKE BUTTON TO TOGGLE */}
      <View
        style={[
          globalStyles.connectedUserButton,
          { backgroundColor: colors["quiC"] },
        ]}
      >
        {bConnected ? (
          <Pressable onPress={onPressFun}>
            <Ionicons
              size={28}
              name="checkmark-done-outline"
              color={colors["primeCarT"]}
            />
          </Pressable>
        ) : (
          <Pressable onPress={onPressFun}>
            <Ionicons
              size={28}
              name="time-outline"
              color={colors["primeCarT"]}
            />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}
