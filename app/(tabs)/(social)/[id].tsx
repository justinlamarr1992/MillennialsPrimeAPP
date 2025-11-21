import { Text, useColorScheme, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export default function id() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <Text
        style={[
          globalStyles.textHuge,
          globalStyles.padding,
          { color: colors["priT"] },
        ]}
      >
        HI this should change: {id}
      </Text>
    </ScrollView>
  );
}
