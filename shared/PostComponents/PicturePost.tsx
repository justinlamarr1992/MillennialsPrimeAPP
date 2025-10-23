import React from "react";
import { Text, Pressable, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "./UserInfo";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import LikeComment from "../LikeComment";
import LoadingPic from "@/assets/images/MillennialsPrimeLogoNB.png";

interface PicturePostProps {
  name: string;
  title: string;
  description: string;
  prime: boolean;
  admin: boolean;
  picture?: string;
}

export default function PicturePost({
  name,
  title,
  description,
  prime,
  admin,
  picture,
}: PicturePostProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const viewer = 12345678;
  const mine = 12345678;
  // TODO: Add dynamic ID Check with auth to match if the post can be deleted

  const removePost = () => {
    // TODO: Implement post deletion
  };
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
      {/* User info here */}
      <UserInfo name={"Picture post Name Here"} admin={admin} prime={prime} />
      {/* Picture here */}
      <Image
        style={globalStyles.image}
        source={picture ? { uri: picture } : LoadingPic}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
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
        {title ? title : "No Title yet"}
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
        {description ? description : "No description Yet"}
      </Text>
      {/* likes and comments */}
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
