import { View, Text, ScrollView } from "react-native";
import React from "react";
import { globalStyles } from "@/constants/global";
import { useTheme } from "@react-navigation/native";

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
  const colors = useTheme().colors;
  return (
    <View
      style={[
        globalStyles.showView,
        globalStyles.centerItem,
        globalStyles.vertMargin,
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
