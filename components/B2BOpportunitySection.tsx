import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";

interface B2BOpportunitySectionProps {
  b2bEnabled?: boolean;
  industry?: string;
  b2bTags?: string[];
}

export default function B2BOpportunitySection({
  b2bEnabled,
  industry,
  b2bTags = [],
}: B2BOpportunitySectionProps): JSX.Element | null {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (!b2bEnabled) return null;

  const hasContent = (industry && industry.trim() !== "") || b2bTags.length > 0;
  if (!hasContent) return null;

  return (
    <View
      style={globalStyles.padding}
      accessibilityLabel="Business to business opportunities"
      accessibilityRole="summary"
    >
      <Text style={[globalStyles.textTitle, globalStyles.marginB8, { color: colors.text }]}>
        B2B Opportunities
      </Text>

      {industry && industry.trim() !== "" && (
        <Text style={[globalStyles.labelText, globalStyles.marginB8, { color: colors.priT }]}>
          {industry}
        </Text>
      )}

      {b2bTags.length > 0 && (
        <View style={[globalStyles.flexRow, globalStyles.flexWrap, globalStyles.gap8]}>
          {b2bTags.map((tag) => (
            <View
              key={tag}
              style={[globalStyles.borderDefault, { backgroundColor: colors.hexC, borderColor: colors.hexC }]}
              accessibilityLabel={`B2B service: ${tag}`}
            >
              <Text style={[globalStyles.labelText, { color: colors.secT }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
