import React, { useContext } from "react";
import { useColorScheme, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import LoadingPic from "@/assets/images/MillennialsPrimeLogoNB.png";
import { COLORS } from "@/constants/Colors";
import UserInfo from "./UserInfo";

interface ItemProps {
  itemName: string;
  picture: string;
  description: string;
  price: number;
  prime: boolean;
  admin: boolean;
}

export default function PicturePost({
  itemName,
  picture,
  description,
  price,
  prime,
  admin,
}: ItemProps) {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

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
            ? [
                globalStyles.itemTitle,
                globalStyles.adminItemContent,
                globalStyles.marginB10,
              ]
            : prime
            ? [
                globalStyles.itemTitle,
                globalStyles.primeItemContent,
                globalStyles.marginB10,
              ]
            : [
                globalStyles.itemTitle,
                globalStyles.itemContent,
                globalStyles.marginB10,
              ]
        }
      >
        {itemName ? itemName : "No Title yet"}
      </Text>

      {/* Picture here */}
      <Image
        style={globalStyles.itemImage}
        source={{ blurhash }}
        placeholder={{ LoadingPic }}
        contentFit="cover"
        transition={1000}
      />
      {/* Item Info Box */}
      <View style={[globalStyles.itemInfoBox, globalStyles.marginVertical]}>
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
      {/* Purchase Button */}
      <Pressable
        style={
          admin
            ? [globalStyles.adminItemButton]
            : prime
            ? [globalStyles.primeItemButton]
            : [globalStyles.itemButton]
        }
        // style={[
        //   globalStyles.itemButton,
        //   globalStyles.marginVert2,
        //   { backgroundColor: colors["hexC"] },
        // ]}
        // onPress={() => navigation.navigate("Sign In")}
      >
        <Link replace href="/(auth)/SignInScreen">
          <Text
            style={
              admin
                ? [globalStyles.itemAdminButtonText, globalStyles.buttonText]
                : prime
                ? [globalStyles.itemPrimeButtonText, globalStyles.buttonText]
                : [globalStyles.itemButtonText, globalStyles.buttonText]
            }
          >
            Buy Now
          </Text>
        </Link>
      </Pressable>
      {/* likes and comments */}
      {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
        Likes
      </Text> */}
    </LinearGradient>
  );
}
