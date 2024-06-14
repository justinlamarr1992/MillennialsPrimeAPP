import React, { useState } from "react";
import { View, Text, useColorScheme, Pressable } from "react-native";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import ConnectedUserInfo from "./ConnectedUserInfo";
import { Ionicons } from "@expo/vector-icons";

export default function PrimeUser({ name, industry, connected, matching }) {
  const [bConnected, setBConnected] = useState(connected);
  let prime = true;
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
      colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
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
          { backgroundColor: colors["secC"] },
        ]}
      >
        {bConnected ? (
          <Pressable onPress={onPressFun}>
            <Ionicons
              size={28}
              name="checkmark-done-outline"
              color={colors["showCarT"]}
            />
          </Pressable>
        ) : (
          <Pressable onPress={onPressFun}>
            <Ionicons
              size={28}
              name="time-outline"
              color={colors["showCarT"]}
            />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}
