import React from "react";
import {
  View,
  Text,
  Image,
  useColorScheme,
  Pressable,
} from "react-native";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import pic from "@/assets/images/MillennialsPrimeLogoNB.png";

interface ConnectedUserInfoProps {
  name: string;
  industry: string;
  prime: boolean;
  matching: boolean;
  connected: boolean;
  admin: boolean;
}

export default function ConnectedUserInfo({
  name,
  industry,
  prime,
  matching,
  connected,
  admin,
}: ConnectedUserInfoProps) {
  // TODO: come back and change so that prime is past through as child to determine what colors

  //   let name = "Test Name";
  //   let time = Date.now();
  //   let prime = false;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Removed unused functions
  return (
    <View style={globalStyles.postUserInfo}>
      <View style={globalStyles.postUserInfoPicContainer}>
        {/* TODO: Add dynamic picture */}
        {/* TODO: Pressing take to users profile */}
        <Image style={globalStyles.postUserInfoImage} source={pic} />
      </View>
      <View style={globalStyles.postUserInfoTextContainer}>
        {/* TODO: make this the route to their userid/Profile */}
        <Pressable onPress={() => {
          // TODO: Implement navigation to user profile
          console.log(`Navigate to user: ${name}`);
        }}>
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
        <Text>
          Industry:
          {/* Make this the route to the page where list of everyone with industry is at may need new page*/}
          {/* DIFFERENT ROUTE TO DIFF PAGE WITH ALL AS THOS W AS AN INDUSTRY */}
          <Pressable onPress={() => {
            // TODO: Implement navigation to industry page
            console.log(`Navigate to industry: ${industry}`);
          }}>
            <Text style={globalStyles.bold}>
              {/* If Prime */}
              {prime ? (
                // IF Admin
                <Text>
                  {matching ? (
                    <Text style={{ color: colors["triC"] }}> {industry}</Text>
                  ) : (
                    <Text> {industry}</Text>
                  )}
                </Text>
              ) : (
                // Not Prime
                <Text>
                  {matching ? (
                    <Text style={{ color: colors["quaC"] }}> {industry}</Text>
                  ) : (
                    <Text> {industry}</Text>
                  )}
                </Text>
              )}
            </Text>
          </Pressable>
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
