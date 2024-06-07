import { View, Text, useColorScheme, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
        HI: {id}
      </Text>
    </View>
  );
}
