import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";

export default function Ad({ title, description }) {
  return (
    // <View style={globalStyles.adPost}>
    //   <Text style={{ ...globalStyles.adTitle, ...globalStyles.postContent }}>
    //     More to Come
    //   </Text>

    //   {/* <Text style={{ ...globalStyles.adTitle, ...globalStyles.postContent }}>
    //     {title}
    //   </Text> */}
    //   {/* <Text
    //     style={{ ...globalStyles.adDescription, ...globalStyles.postContent }}
    //   >
    //     {description}
    //   </Text> */}
    //   {/* <Text style={{ ...globalStyles.postLikes, ...globalStyles.postContent }}>
    //     Likes
    //   </Text> */}
    // </View>

    <LinearGradient
      style={globalStyles.adPost}
      colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
    >
      <Text style={{ ...globalStyles.adTitle, ...globalStyles.postContent }}>
        More to Come
      </Text>
    </LinearGradient>
  );
}
