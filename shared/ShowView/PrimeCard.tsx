import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "@/constants/global";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";

import UserInfo from "../PostComponents/UserInfo";
import { Ionicons } from "@expo/vector-icons";

interface PrimeCardProps {
  userPosting: string;
  id: string;
  prime: boolean;
  thumbnail: string;
  videoLibraryId: string;
  guid: string;
  title: string;
  description: string;
  dateUploaded: string;
  name: string;
  time: string;
  key: string;
}

export default function PrimeCard({
  userPosting,
  id,
  prime,
  thumbnail,
  videoLibraryId,
  guid,
  title,
  description,
  dateUploaded,
  name,
  time,
  key,
}: PrimeCardProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  var confirm;

  console.log(id, description, prime, userPosting);

  const pressedVideo = () => {
    // @ts-ignore - Legacy route 'PrimeShow' not in current navigation structure
    // TODO: Either remove this legacy route or update navigation types to include it
    // See: https://github.com/justinlamarr1992/MillennialsPrimeAPP/issues - needs investigation
    navigation.navigate("PrimeShow", {
      guid: guid,
      videoLibraryId: videoLibraryId,
      title: title,
      description: description,
      dateUploaded: dateUploaded,
    });
  };
  const deleteVideo = () => {
    console.log("Dang you was gone delete the video forreal");
    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        // Test
        AccessKey: "8ad268ac-6b0a-46fb-92d9b1a6d918-c4e1-4edf",
        // Live
        // AccessKey: "a80779d4-9931-4345-80c1ca2315d2-fc09-4143",
      },
    };

    fetch(
      `https://video.bunnycdn.com/library/${videoLibraryId}/videos/${guid}`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  const checkOriginal = () => {
    console.log(id);
    userPosting = `"${userPosting}"`;
    console.log(userPosting);
    if (id === userPosting) {
      // console.log("They match", id, userPosting);
      confirm = true;
      return;
    }
  };
  checkOriginal();

  return (
    <LinearGradient
      key={key}
      style={[
        globalStyles.post,
        globalStyles.flexRow,
        globalStyles.showView,
        globalStyles.marginVertical,
      ]}
      colors={
        prime
          ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
          : ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"]
      }
    >
      <TouchableOpacity
        onPress={pressedVideo}
        style={[globalStyles.primeCardLeft]}
      >
        <Text
          style={
            prime
              ? [globalStyles.showViewTitle, { color: colors.primeCarT }]
              : [globalStyles.showViewTitle, { color: colors.showCarT }]
          }
        >
          {title}
        </Text>
        <Text
          style={[globalStyles.showViewDescription, { color: colors.primeCarT }]}
        >
          {description ? description : "No Description for now"}
        </Text>
        <Text
          style={[
            globalStyles.showViewDescription,
            globalStyles.bottomPadding10,
            { color: colors.triT },
          ]}
        >
          Date Uploaded: {dateUploaded ? dateUploaded : "Loading"}
        </Text>
        {/* Add a symbol indication that this is a prime post or only for users with prime */}
        <Text
          style={[
            globalStyles.showViewDescription,
            globalStyles.bottomPadding10,
            { color: colors.triT },
          ]}
        >
          Prime: {prime ? "True" : "False"}
        </Text>
      </TouchableOpacity>
      {confirm && (
        <TouchableOpacity
          style={[globalStyles.primeCardRight]}
          onPress={deleteVideo}
        >
          {prime ? (
            <Ionicons name="trash" size={24} color="#611821" />
          ) : (
            <Ionicons name="trash" size={24} color="#fffd9b" />
          )}
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}
