import { Text, View, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { COLORS } from "@/constants/Colors";

/**
 * Social Feed Screen
 *
 * This will display the main social feed showing:
 * - Featured stories carousel
 * - Posts from connections
 * - Social activity
 *
 * Currently showing placeholder until feed implementation (Phase 4)
 */
export default function SocialFeedScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.priT }]}>
          Social Feed
        </Text>
        <Text style={[styles.subtitle, { color: colors.triT }]}>
          Coming Soon
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          Your social feed will show posts from your connections, featured stories, and social activity.
        </Text>
        <Text style={[styles.note, { color: colors.triT }]}>
          Phase 4: Discovery & Engagement
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
