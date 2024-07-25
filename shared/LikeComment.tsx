import { View, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "@/constants/global";

export default function LikeComment() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const size = 20;
  return (
    <View
      style={[
        globalStyles.flexRow,
        globalStyles.flex2,
        globalStyles.flexJustifyContentSpaceBetween,
      ]}
    >
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.flexJustifyContentSpaceBetween,
        ]}
      >
        {/* Likes */}
        <Ionicons name="heart-outline" size={size} color={colors["secC"]} />
        <Ionicons name="heart" size={size} color={colors["secC"]} />
        {/* Dislikes */}
        <Ionicons name="skull-outline" size={size} color={colors["hexC"]} />
        <Ionicons name="skull" size={size} color={colors["hexC"]} />
        {/* Comments */}
        <Ionicons
          name="chatbox-outline"
          size={size}
          color={colors["defaultText"]}
        />
        <Ionicons name="chatbox" size={size} color={colors["defaultText"]} />
      </View>
      <View style={globalStyles.flexRow}>
        {/* Shares */}
        <Text>
          <Ionicons
            name="arrow-redo-sharp"
            size={size}
            color={colors["defaultText"]}
          />
        </Text>
      </View>
    </View>
  );
}
// colors["background"];
