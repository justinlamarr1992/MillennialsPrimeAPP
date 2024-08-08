import { View, Text } from "react-native";
import React from "react";
import { globalStyles } from "@/constants/global";

export default function NumberCard({ number = 0, unit }) {
  function numberText() {
    if (number && Math.sign(number) >= 0) {
      if (number.toString().length === 1) {
        return ("0" + number).slice(-2);
      } else {
        return number;
      }
    } else {
      return "00";
    }
  }
  const renderNumber = () => (
    <Text style={globalStyles.timerNumber}>{numberText()}</Text>
  );
  return (
    <View style={globalStyles.timerBlock}>
      {renderNumber()}
      <Text style={globalStyles.timerUnit}>{unit}</Text>
    </View>
  );
}
