import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Video, ResizeMode } from "expo-av";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";
import colors from "../../../styles/colors";

export default function VideoPost({
  url,
  title,
  description,
  prime,
  libraryId,
  videoId,
}) {
  const colors = useTheme().colors;

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <LinearGradient
      style={globalStyles.post}
      colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
    >
      {/* User info here */}
      <UserInfo />
      <WebView
        source={{
          uri: `https://video.bunnycdn.com/embed/${
            libraryId ? libraryId : 147838
          }/${videoId ? videoId : "ec4cbe34-8750-4695-b252-69f53e51627a"}`,
        }}
        style={{ ...globalStyles.postVideo, ...globalStyles.postContent }}
      />

      {/* Title */}
      <Text
        style={[
          globalStyles.postTitle,
          globalStyles.postContent,
          { color: colors.secT },
        ]}
      >
        {title ? title : "No Title Yet"}
      </Text>
      {/* description */}
      <Text
        style={[
          globalStyles.postDescription,
          globalStyles.postContent,
          { color: colors.triT },
        ]}
      >
        {description ? description : "No Description Yet"}
      </Text>
      {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
        Likes
      </Text> */}
    </LinearGradient>
  );
}
