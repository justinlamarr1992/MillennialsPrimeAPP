import React from "react";
import { Text, Pressable, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import LikeComment from "../LikeComment";

interface VideoPostProps {
  url?: string;
  title: string;
  description: string;
  prime: boolean;
  admin: boolean;
  libraryId?: string | number;
  videoId?: string;
}

export default function VideoPost({
  url,
  title,
  description,
  prime,
  admin,
  libraryId,
  videoId,
}: VideoPostProps) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const viewer = 12345678;
  const mine = 12345678;
  // TODO: Add dynamic ID Check with auth to match if the post can be deleted

  const removePost = () => {
    console.log("Post to be removed in the background");
  };
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
      {/* User info here */}
      <UserInfo name={"Video Post Name Here"} admin={admin} prime={prime} />
      {/* TODO: Round the corners */}
      <WebView
        source={{
          uri: `https://video.bunnycdn.com/embed/${
            libraryId ? libraryId : 147838
          }/${videoId ? videoId : "ec4cbe34-8750-4695-b252-69f53e51627a"}`,
        }}
        style={{ ...globalStyles.postVideo, ...globalStyles.postContent }}
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
      <LikeComment />
      {viewer == mine && (
        <Pressable onPress={removePost} style={globalStyles.alignCenter}>
          <Ionicons
            size={28}
            name="trash"
            color={
              admin
                ? colors["adminDefaultText"]
                : prime
                ? colors["primeDefaultText"]
                : colors["defaultText"]
            }
          />
          {/* <Ionicons size={28} name="trash" color={colors["primeCarT"]} /> */}
        </Pressable>
      )}
    </LinearGradient>
  );
}
