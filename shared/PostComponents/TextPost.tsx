import { Text, Pressable, useColorScheme } from "react-native";
import React, { memo } from "react";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import UserInfo from "./UserInfo";
import LikeComment from "../LikeComment";
import useAuth from "@/hooks/useAuth";

interface TextPostProps {
  name: string;
  title: string;
  description: string;
  prime: boolean;
  admin: boolean;
  authorId: string; // ID of post author for ownership check
}

function TextPost({ name, title, description, prime, admin, authorId }: TextPostProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { user } = useAuth();
  const mine = authorId === user?.uid;

  const removePost = () => {
    // TODO: Implement post deletion
  };
  return (
    <LinearGradient
      style={globalStyles.post}
      // {admin ? : }
      colors={
        admin
          ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
          : prime
          ? ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
          : ["#F7F7F7", "#DEDEDE", "#C4C4C4"]
      }

      // colors={["#F7F7F7", "#DEDEDE", "#C4C4C4"]}
      // colors={["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]}
      // colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
    >
      {/* User Info Here */}
      <UserInfo name={name} admin={admin} prime={prime} />
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
        {title ? title : "No Title yet"}
      </Text>
      {/* Description */}
      <Text
        style={
          admin
            ? [globalStyles.postDescription, globalStyles.adminPostContent]
            : prime
            ? [globalStyles.postDescription, globalStyles.primePostContent]
            : [globalStyles.postDescription, globalStyles.postContent]
        }
      >
        {description ? description : "No description Yet"}
      </Text>
      {/* Likes and Comments */}
      <LikeComment />
      {/* User ability to delete */}
      {mine && (
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

export default memo(TextPost);

// "Colors of what needs to be renderd"={
//         admin
//           ? "Colors/ settings of Admin"
//           : prime
//           ? "colors/ settings of Prime"
//           : "colors/ settings of User"
//       }
