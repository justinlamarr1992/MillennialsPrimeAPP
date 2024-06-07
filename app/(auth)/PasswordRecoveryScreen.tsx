import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalStyles } from "@/constants/global";
import { useNavigation, useTheme } from "@react-navigation/native";

const PasswordRecoveryScreen = () => {
  const navigation = useNavigation();
  const colors = useTheme().colors;

  return (
    <View
      style={[
        globalStyles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* <Text style={(color: colors.primCarT)}>Password Recovery</Text> */}
      <Text style={[globalStyles.titleText, { color: colors.priT }]}>
        Recover Password
      </Text>
    </View>
  );
};
export default PasswordRecoveryScreen;
