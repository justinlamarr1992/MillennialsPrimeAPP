import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "@/constants/global";
import DHMSTimer from "./Timer/DHMSTimer";

interface AdProps {
  title: string;
  description?: string;
  // Accepts both string and Date to support various data sources (API responses, database, etc.)
  // Normalized to string in the component for DHMSTimer compatibility
  startDate: string | Date;
}

export default function Ad({ title, startDate }: AdProps) {
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
      style={[
        globalStyles.adPost,
        globalStyles.flexColumn,
        globalStyles.flexAlignItemsCenter,
      ]}
      colors={["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]}
    >
      <Text style={{ ...globalStyles.adTitle, ...globalStyles.postContent }}>
        {title}
      </Text>
      <DHMSTimer
        startDate={typeof startDate === 'string' ? startDate : startDate.toISOString()}
        // onTimerFinished={onTimerFinished}
      />
    </LinearGradient>
  );
}
