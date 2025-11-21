import React, { useState } from "react";
import { View, Button } from "react-native";
import { globalStyles } from "../constants/global";
import UserInfo from "../shared/PostComponents/UserInfo";
import { LinearGradient } from "expo-linear-gradient";

interface TestCompsProps {
  navigation: {
    goBack: () => void;
  };
}

export default function TestComps({ navigation }: TestCompsProps) {
  // Determins if the post will be red or gold
  const [prime] = useState(false);
  const name = "Test Name";
  const admin = false;

  const pressHandler = () => {
    navigation.goBack();
  };

  return (
    <View>
      <LinearGradient
        style={globalStyles.post}
        colors={
          prime
            ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
            : ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
        }
      >
        <UserInfo prime={prime} name={name} admin={admin} />
      </LinearGradient>

      <Button title="Back to Home Screen" onPress={pressHandler} />
    </View>
  );
}
