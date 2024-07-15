import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

export default function modal() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.centerItem,
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
        modal
      </Text>
    </View>
  );
}
