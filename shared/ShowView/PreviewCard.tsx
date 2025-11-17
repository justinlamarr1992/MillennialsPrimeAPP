import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

interface PreviewCardProps {
  title: string;
  description: string;
}

export default function PreviewCard({
  title,
  description,
}: PreviewCardProps) {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  return (
    <View
      style={[
        globalStyles.showView,
        globalStyles.centerItem,
        globalStyles.marginVertical,
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
