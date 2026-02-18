/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

import { COLORS } from "@/constants/Colors";
import type { Colors } from "@/constants/Colors";

// Restrict to keys whose value is a plain string (excludes gradient array keys)
type StringColorKey = {
  [K in keyof Colors]: Colors[K] extends string ? K : never;
}[keyof Colors];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: StringColorKey
): string {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return COLORS[theme][colorName] as string;
  }
}
