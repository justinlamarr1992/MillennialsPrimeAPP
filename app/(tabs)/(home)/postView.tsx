import { View, Text, Button, useColorScheme } from "react-native";
import React from "react";
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

export default function postView() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <View
      style={[
        globalStyles.container,

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
        postView
      </Text>
      <Button onPress={() => router.push("/homeScreen")} title="Go to Home" />
    </View>
  );
}
