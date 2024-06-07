import React, { useContext } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";
import { useTheme } from "@react-navigation/native";
import pic from "@/assets/images/MillennialsPrimeLogoNB.png";
export default function UserInfo() {
  // TODO: come back and change so that prime is past through as child to determine what colors
  // export default function UserInfo({ prime, name, time }) {
  let name = "Test Name";
  let time = Date.now();
  let prime = false;
  const colors = useTheme().colors;
  // console.log(prime, name, time);
  return (
    <View style={globalStyles.postUserInfo}>
      <View style={globalStyles.postUserInfoPicContainer}>
        {/* TODO: Add dynamic picture */}
        {/* TODO: Pressing take to users profile */}
        <Image style={globalStyles.postUserInfoImage} source={pic} />
      </View>
      <View style={globalStyles.postUserInfoTextContainer}>
        <Text
          style={
            prime
              ? globalStyles.primePostUserInfoName
              : globalStyles.postUserInfoName
          }
        >
          {/* TODO: Pressing this takes to their Profile */}
          {name ? name : "Loading"}
        </Text>
        {/* Add useTheme here to determin is colo rchanges are needed based off of prime or not */}
        <Text style={globalStyles.postUserInfoTime}>
          {time ? time : "Loading"}
        </Text>
      </View>
    </View>
  );
}
