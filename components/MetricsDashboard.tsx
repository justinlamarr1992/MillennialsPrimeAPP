import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export interface Metric {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}

interface MetricsDashboardProps {
  metrics: Metric[];
}

export default function MetricsDashboard({
  metrics,
}: MetricsDashboardProps): JSX.Element | null {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (metrics.length === 0) return null;

  return (
    <View
      style={[globalStyles.padding, globalStyles.flexRow, globalStyles.flexWrap, globalStyles.gap12]}
      accessibilityLabel="Profile metrics"
    >
      {metrics.map((metric) => (
        <View
          key={metric.label}
          style={[
            globalStyles.gap8,
            {
              flex: 1,
              minWidth: "40%",
              padding: 12,
              borderRadius: 12,
              backgroundColor: colors.secC,
              alignItems: "center",
            },
          ]}
        >
          <Ionicons
            name={metric.icon as React.ComponentProps<typeof Ionicons>["name"]}
            size={24}
            color={colors.priC}
          />
          <Text style={[globalStyles.textTitle, { color: colors.text }]}>
            {metric.value}
          </Text>
          <Text style={[globalStyles.labelText, { color: colors.triT }]}>
            {metric.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
