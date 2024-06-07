import { View, Text } from "react-native";
import React, { useEffect } from "react";

import { Stack, useNavigation } from "expo-router";

import { useTheme } from "@react-navigation/native";

export default function TestScreen() {
  const colors = useTheme().colors;
  // No Header
  const navigation = useNavigation();

  // No Header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <View>
      <Text>TestScreen</Text>
    </View>
  );
}
