import { View, Text } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function TestScreen() {
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
