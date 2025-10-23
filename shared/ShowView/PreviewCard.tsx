import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

interface PreviewCardProps {
  thumbnail: string;
  title: string;
  description: string;
  name: string;
  time: string;
}

export default function PreviewCard({
  thumbnail,
  title,
  description,
  name,
  time,
}: PreviewCardProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <View
      style={[
        globalStyles.showView,
        globalStyles.centerItem,
        { backgroundColor: colors.showCar },
      ]}
    >
      <Text style={[globalStyles.showViewTitle, { color: colors.showCarT }]}>
        {title}
      </Text>
      <Text
        style={[
          globalStyles.showViewDescription,
          globalStyles.bottomPadding10,
          { color: colors.showCarT },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}
