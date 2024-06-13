import React, { useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import ConnectedUserInfo from "./ConnectedUserInfo";
import { Ionicons } from "@expo/vector-icons";

export default function User({ name, industry, connected, matching }) {
  let prime = false;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <LinearGradient
      style={globalStyles.postConnectedUser}
      colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
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
        {connected ? (
          <Ionicons
            size={28}
            name="checkmark-done-outline"
            color={colors["primeCarT"]}
          />
        ) : (
          <Ionicons size={28} name="time-outline" color={colors["primeCarT"]} />
        )}
      </View>
    </LinearGradient>
  );
}
