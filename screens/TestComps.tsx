import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import { globalStyles, images } from "../constants/global";
import Card from "../shared/Card";
import PostComponent from "../shared/PostComponent";
import UserInfo from "../shared/PostItems/UserInfo";
import { LinearGradient } from "expo-linear-gradient";

export default function TestComps({ navigation }) {
  // Determins if the post will be red or gold
  const [prime, setPrime] = useState(false);
  const name = "Test Name";
  const time = "5 mins ago";
  // const { item } = route.params;

  // const rating = item.rating;

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
        <UserInfo prime={prime} name={name} time={time} />
      </LinearGradient>

      <Button title="Back to Home Screen" onPress={pressHandler} />
    </View>
  );
}
