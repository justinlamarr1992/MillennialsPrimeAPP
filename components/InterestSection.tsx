import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";

interface InterestSectionProps {
  interests: string[];
}

export default function InterestSection({ interests }: InterestSectionProps): JSX.Element | null {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (interests.length === 0) return null;

  return (
    <View
      style={globalStyles.padding}
      accessibilityLabel="User interests"
      accessibilityRole="summary"
    >
      <Text style={[globalStyles.textTitle, globalStyles.marginB8, { color: colors.text }]}>
        Interests
      </Text>
      <View style={[globalStyles.flexRow, globalStyles.flexWrap, globalStyles.gap8]}>
        {interests.map((interest) => (
          <View
            key={interest}
            style={[globalStyles.borderDefault, { backgroundColor: colors.secC, borderColor: colors.secC }]}
            accessibilityLabel={`Interest: ${interest}`}
          >
            <Text style={[globalStyles.labelText, { color: colors.secT }]}>
              {interest}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
