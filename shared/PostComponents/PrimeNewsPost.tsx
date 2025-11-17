import React from "react";
import { Text } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";
import { globalStyles } from "@/constants/global";

interface PrimeNewsPostProps {
  guid: string;
  videoLibraryId: string;
  title: string;
  description: string;
  prime: boolean;
  admin: boolean;
}

export default function PrimeNewsPost({
  guid,
  videoLibraryId,
  title,
  description,
  prime,
  admin,
}: PrimeNewsPostProps) {
  // Determins if the post will be red or gold

  return (
    <LinearGradient
      style={globalStyles.post}
      colors={
        admin
          ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
          : ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
      }
    >
      <WebView
        source={{
          uri: `https://video.bunnycdn.com/embed/${videoLibraryId}/${guid}`,
        }}
        width="100%"
        height="auto"
        style={{
          border: "none",
          maxWidth: 1280,
          maxHeight: 720,
          ...globalStyles.postVideo,
          ...globalStyles.postContent,
        }}
        mediaPlaybackRequiresUserAction={true}
      />

      {/* Title */}
      <Text
        style={
          admin
            ? [globalStyles.postTitle, globalStyles.adminPostContent]
            : prime
            ? [globalStyles.postTitle, globalStyles.primePostContent]
            : [globalStyles.postTitle, globalStyles.postContent]
        }
      >
        {title ? title : "No Title Yet"}
      </Text>
      {/* description */}
      <Text
        style={
          admin
            ? [globalStyles.postDescription, globalStyles.adminPostContent]
            : prime
            ? [globalStyles.postDescription, globalStyles.primePostContent]
            : [globalStyles.postDescription, globalStyles.postContent]
        }
      >
        {description ? description : "No Description Yet"}
      </Text>
      <UserInfo
        name="Millennials Prime Admin"
        // name={"Video Post Name Here"}
        admin={admin}
        prime={prime}
      />
      {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
        Likes
      </Text> */}
      {/* <LikeComment /> */}
    </LinearGradient>
  );
}
