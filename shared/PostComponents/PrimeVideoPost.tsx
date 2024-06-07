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
      colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
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
          { color: colors.triT },
        ]}
      >
        {title ? title : "No Title Yet"}
      </Text>
      {/* description */}
      <Text
        style={[
          globalStyles.postDescription,
          globalStyles.postContent,
          { color: colors.priT },
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

// src="https://iframe.dacast.com/vod/4cb5f7e0-f945-e8aa-b1a8-62e9bf774b85/d71bda38-3ae5-40aa-8c24-93179412e432"

//   <script
//   id="4cb5f7e0-f945-e8aa-b1a8-62e9bf774b85-vod-d71bda38-3ae5-40aa-8c24-93179412e432"
//   width="100%"
//   height="100%"
//   src="https://player.dacast.com/js/player.js?contentId=4cb5f7e0-f945-e8aa-b1a8-62e9bf774b85-vod-d71bda38-3ae5-40aa-8c24-93179412e432"
//   class="dacast-video"
// ></script>;

// https://iframe.dacast.com/vod/4cb5f7e0-f945-e8aa-b1a8-62e9bf774b85/d71bda38-3ae5-40aa-8c24-93179412e432
