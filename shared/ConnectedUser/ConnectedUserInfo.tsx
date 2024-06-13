import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@react-navigation/native";
import pic from "@/assets/images/MillennialsPrimeLogoNB.png";
export default function ConnectedUserInfo({
  name,
  industry,
  prime,
  matching,
  connected,
}) {
  // TODO: come back and change so that prime is past through as child to determine what colors

  //   let name = "Test Name";
  //   let time = Date.now();
  //   let prime = false;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
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
        <Text>
          Industry:
          <Text style={globalStyles.bold}>
            {prime ? (
              <Text>
                {matching ? (
                  <Text style={{ color: colors["triC"] }}> {industry}</Text>
                ) : (
                  <Text> {industry}</Text>
                )}
              </Text>
            ) : (
              <Text>
                {matching ? (
                  <Text style={{ color: colors["quaC"] }}> {industry}</Text>
                ) : (
                  <Text> {industry}</Text>
                )}
              </Text>
            )}
          </Text>
        </Text>

        {/* {prime ? (<Text style={globalStyles.postUserInfoTime}>
          Industry: {industry ? industry : "Loading"})
         : (<Text style={globalStyles.postUserInfoTime}>
          Industry: {industry ? industry : "Loading"}
        </Text> )} */}
      </View>
    </View>
  );
}
