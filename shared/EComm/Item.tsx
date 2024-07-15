import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import LoadingPic from "@/assets/images/MillennialsPrimeLogoNB.png";
import UserInfo from "./UserInfo";
import colors from "../../../styles/colors";

export default function PicturePost({
  itemName,
  picture,
  description,
  price,
  prime,
  admin,
}) {
  const colors = useTheme().colors;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <LinearGradient
      style={globalStyles.post}
      colors={
        admin
          ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
          : prime
          ? ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
          : ["#F7F7F7", "#DEDEDE", "#C4C4C4"]
      }
    >
            {/* Title */}
      <Text
        style={
          admin
            ? [globalStyles.itemTitle, globalStyles.adminItemContent]
            : prime
            ? [globalStyles.itemTitle, globalStyles.primeItemContent]
            : [globalStyles.itemTitle, globalStyles.itemContent]
        }
      >
        {itemName ? itemName : "No Title yet"}
      </Text>

      {/* Picture here */}
      <Image
        style={globalStyles.image}
        source={{ blurhash }}
        placeholder={{ LoadingPic }}
        contentFit="cover"
        transition={1000}
      />
      {/* Item Info Box */}
<View  style={globalStyles.itemInfoBox}>
   {/* description */}
      <Text
        style={
          admin
            ? [globalStyles.itemDescription, globalStyles.adminItemContent]
            : prime
            ? [globalStyles.itemDescription, globalStyles.primeItemContent]
            : [globalStyles.itemDescription, globalStyles.postContent]
        }
      >
        {description ? description : "No description Yet"}
      </Text>
      {/* price */}
      <Text
        style={
          admin
            ? [globalStyles.itemPrice, globalStyles.adminItemContent]
            : prime
            ? [globalStyles.itemPrice, globalStyles.primeItemContent]
            : [globalStyles.itemPrice, globalStyles.postContent]
        }
      >
        {price ? price : "$###.##"}
      </Text>
</View>
     
            {/* User info here */}
      <UserInfo name={"Picture post Name Here"} admin={admin} prime={prime} />
      {/* likes and comments */}
      {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
        Likes
      </Text> */}
    </LinearGradient>
  );
}
