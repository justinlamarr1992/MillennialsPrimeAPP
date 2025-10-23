import React, { useContext } from "react";
import { StyleSheet, View, Text, Image, Button, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";
import { useTheme } from "@react-navigation/native";
import { router, Href } from "expo-router";
import pic from "@/assets/images/MillennialsPrimeLogoNB.png";

interface UserInfoProps {
  name: string;
  admin: boolean;
  prime: boolean;
}

export default function UserInfo({ name, admin, prime }: UserInfoProps) {
  // TODO: come back and change so that prime is past through as child to determine what colors
  // export default function UserInfo({ prime, name, time }) {
  // let name = "Test Name";
  let time = Date.now();
  const colors = useTheme().colors;
  // console.log(prime, name, time);

  const namePress = () => {
    console.log("Name Pressed");
  };
  return (
    <View style={globalStyles.postUserInfo}>
      <View style={globalStyles.postUserInfoPicContainer}>
        {/* TODO: Add dynamic picture */}
        {/* TODO: Pressing take to users profile */}
        <Image style={globalStyles.postUserInfoImage} source={pic} />
      </View>
      <View style={globalStyles.postUserInfoTextContainer}>
        {/* TODO: Change this to the user id of the user name so pressing can go to users page */}
        <Pressable onPress={() => router.push(`/${name}` as Href)}>
          <Text
            style={
              admin
                ? globalStyles.adminPostUserInfoName
                : prime
                ? globalStyles.primePostUserInfoName
                : globalStyles.postUserInfoName
            }
          >
            {/* TODO: Pressing this takes to their Profile */}
            {name ? name : "Loading"}
          </Text>
        </Pressable>

        {/* Add useTheme here to determin is colo rchanges are needed based off of prime or not */}
        {/* <Text style={globalStyles.postUserInfoTime}>
          {time ? time : "Loading"}
        </Text> */}
      </View>
    </View>
  );
}
