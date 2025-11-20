import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface ContentCardProps {
  title: string;
  description?: string;
  dateUploaded?: string;
  isPrime?: boolean;
  showMenu?: boolean;
  showNewBadge?: boolean;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

/**
 * Pure component for rendering content cards in carousels
 * Follows clean code and functional principles
 *
 * @pure No side effects, renders based on props only
 */
const ContentCard = ({
  title,
  description,
  dateUploaded,
  isPrime = false,
  showMenu = false,
  showNewBadge = false,
  onPress,
  onMenuPress,
}: ContentCardProps): JSX.Element => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const gradientColors = getGradientColors(isPrime);
  const textColor = getTextColor(isPrime, colors);

  return (
    <View style={styles.cardContainer}>
      <LinearGradient colors={gradientColors} style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={onPress}
          activeOpacity={0.8}
        >
          {showNewBadge && <NewBadge colors={colors} />}
          <CardBody
            title={title}
            description={description}
            dateUploaded={dateUploaded}
            textColor={textColor}
            isPrime={isPrime}
          />
        </TouchableOpacity>
        {showMenu && <MenuButton onPress={onMenuPress} isPrime={isPrime} />}
      </LinearGradient>
    </View>
  );
};

/**
 * Pure function to determine gradient colors based on prime status
 *
 * @pure Same input always returns same output
 */
const getGradientColors = (isPrime: boolean): string[] =>
  isPrime
    ? ["#b9a054", "#cbb665", "#ddcd76", "#eee588", "#fffd9b"]
    : ["#bd2932", "#a5242f", "#8e202b", "#771c26", "#611821"];

/**
 * Pure function to determine text color
 *
 * @pure Same input always returns same output
 */
const getTextColor = (isPrime: boolean, colors: any): string =>
  isPrime ? colors.primeCarT : colors.showCarT;

/**
 * Pure component for "New" badge display
 *
 * @pure Renders UI based on props only
 */
const NewBadge = ({ colors }: { colors: any }): JSX.Element => (
  <View style={[styles.newBadge, { backgroundColor: colors.triC }]}>
    <Text style={[styles.newBadgeText, { color: colors.secT }]}>
      New Episode
    </Text>
  </View>
);

/**
 * Pure component for card body content
 *
 * @pure Renders UI based on props only
 */
const CardBody = ({
  title,
  description,
  dateUploaded,
  textColor,
  isPrime,
}: {
  title: string;
  description?: string;
  dateUploaded?: string;
  textColor: string;
  isPrime: boolean;
}): JSX.Element => (
  <>
    <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
      {title}
    </Text>
    {description && (
      <Text style={[styles.description, { color: textColor }]} numberOfLines={3}>
        {description}
      </Text>
    )}
    {dateUploaded && (
      <Text style={[styles.date, { color: textColor, opacity: 0.7 }]}>
        {formatDate(dateUploaded)}
      </Text>
    )}
  </>
);

/**
 * Pure component for 3-dot menu button
 *
 * @pure Renders UI based on props only
 */
const MenuButton = ({
  onPress,
  isPrime,
}: {
  onPress?: () => void;
  isPrime: boolean;
}): JSX.Element => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Ionicons
      name="ellipsis-vertical"
      size={20}
      color={isPrime ? "#611821" : "#fffd9b"}
    />
  </TouchableOpacity>
);

/**
 * Pure function to format date string
 *
 * @pure Same input always returns same output
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 6,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 180,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  newBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    marginTop: "auto",
  },
  menuButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
});

export default ContentCard;
