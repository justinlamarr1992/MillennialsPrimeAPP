import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";

export default function PrimeTextPost({ title, description, prime }) {
  const colors = useTheme().colors;
  return (
    <LinearGradient
      style={globalStyles.post}
      colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
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
        This is a Text Post Title
      </Text>
      {/* Description */}
      <Text
        style={[
          globalStyles.postDescription,
          globalStyles.postContent,
          { color: colors.priT },
        ]}
      >
        This is where the description of the text Post will go, but it will be
        however long the user types... However we may need to restrict this by a
        maximum of 10 lines
      </Text>
      {/* Likes and Comments */}
    </LinearGradient>
  );
}
