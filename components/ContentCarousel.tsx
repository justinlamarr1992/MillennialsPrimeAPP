import React from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Dimensions,
  StyleSheet,
} from "react-native";
import { COLORS } from "@/constants/Colors";

interface ContentCarouselProps {
  title: string;
  children: React.ReactNode;
  showBadge?: boolean;
  badgeText?: string;
}

const { width } = Dimensions.get("window");

/**
 * Pure component for rendering a horizontal scrolling carousel
 * Follows HBO Max-style content sections
 *
 * @pure No side effects, renders based on props only
 */
const ContentCarousel = ({
  title,
  children,
  showBadge = false,
  badgeText = "New",
}: ContentCarouselProps): JSX.Element => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <View style={styles.carouselContainer}>
      <SectionHeader
        title={title}
        showBadge={showBadge}
        badgeText={badgeText}
        textColor={colors.text}
        badgeBackgroundColor={colors.triC}
        badgeTextColor={colors.secT}
      />
      <HorizontalScroll>{children}</HorizontalScroll>
    </View>
  );
};

/**
 * Pure component for section header with optional badge
 *
 * @pure Renders UI based on props only
 */
const SectionHeader = ({
  title,
  showBadge,
  badgeText,
  textColor,
  badgeBackgroundColor,
  badgeTextColor,
}: {
  title: string;
  showBadge: boolean;
  badgeText: string;
  textColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
}): JSX.Element => (
  <View style={styles.titleContainer}>
    <Text style={[styles.sectionTitle, { color: textColor }]}>
      {title}
    </Text>
    {showBadge && (
      <Badge
        text={badgeText}
        backgroundColor={badgeBackgroundColor}
        textColor={badgeTextColor}
      />
    )}
  </View>
);

/**
 * Pure component for badge display
 *
 * @pure Renders UI based on props only
 */
const Badge = ({
  text,
  backgroundColor,
  textColor,
}: {
  text: string;
  backgroundColor: string;
  textColor: string;
}): JSX.Element => (
  <View style={[styles.badge, { backgroundColor }]}>
    <Text style={[styles.badgeText, { color: textColor }]}>
      {text}
    </Text>
  </View>
);

/**
 * Pure component for horizontal scrolling container
 *
 * @pure Renders children in horizontal scroll view
 */
const HorizontalScroll = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}
    decelerationRate="fast"
    snapToInterval={width * 0.7}
    snapToAlignment="start"
  >
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
});

export default ContentCarousel;
