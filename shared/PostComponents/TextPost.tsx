import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";

export default function TextPost({ title, description, prime }) {
  const colors = useTheme().colors;
  return (
    <LinearGradient
      style={globalStyles.post}
      colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
    >
      {/* User Info Here */}
      <UserInfo />
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
      {/* Description */}
      <Text
        style={[
          globalStyles.postDescription,
          globalStyles.postContent,
          { color: colors.triT },
        ]}
      >
        {description ? description : "No description Yet"}
      </Text>
      {/* Likes and Comments */}
    </LinearGradient>
  );
}
