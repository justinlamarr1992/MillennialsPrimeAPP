import { View, Text, Button, useColorScheme } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export default function Page() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { slug } = useLocalSearchParams();
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
