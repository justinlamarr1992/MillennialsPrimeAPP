import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import LoadingPic from "@/assets/images/MillennialsPrimeLogoNB.png";
import UserInfo from "./UserInfo";
import colors from "../../../styles/colors";

export default function PicturePost({ title, description, prime }) {
  const colors = useTheme().colors;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <LinearGradient
      style={globalStyles.post}
      colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
    >
      {/* User info here */}
      <UserInfo />
      {/* Picture here */}
      <Image
        style={globalStyles.image}
        source={{ blurhash }}
        placeholder={{ LoadingPic }}
        contentFit="cover"
        transition={1000}
      />
      {/* Title */}
      <Text
        style={[
          globalStyles.postTitle,
          globalStyles.postContent,
          { color: colors.secT },
        ]}
      >
        {title ? title : "No Title yet"}
      </Text>
      {/* description */}
      <Text
        style={[
          globalStyles.postDescription,
          globalStyles.postContent,
          { color: colors.triT },
        ]}
      >
        {description ? description : "No description Yet"}
      </Text>
      {/* likes and comments */}
      {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
        Likes
      </Text> */}
    </LinearGradient>
  );
}
