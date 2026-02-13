import React from "react";
import { View, Text, Image, Pressable, FlatList, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";
import type { ConnectionUser } from "@/types/connection";

interface ConnectedUsersGridProps {
  users: ConnectionUser[];
  onUserPress: (userId: string) => void;
  maxDisplay?: number;
}

const DEFAULT_MAX_DISPLAY = 6;

/**
 * Validate if a URI is a valid image source
 * Rejects raw ObjectIds and other invalid strings that cause Image warnings
 */
const isValidImageUri = (uri: string): boolean =>
  uri.startsWith('http') || uri.startsWith('data:') || uri.startsWith('file://');

export default function ConnectedUsersGrid({
  users,
  onUserPress,
  maxDisplay = DEFAULT_MAX_DISPLAY,
}: ConnectedUsersGridProps): JSX.Element | null {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (users.length === 0) return null;

  const visibleUsers = users.slice(0, maxDisplay);
  const overflowCount = users.length - maxDisplay;

  return (
    <View
      style={globalStyles.padding}
      accessibilityLabel="Connected users"
      accessibilityRole="summary"
    >
      <Text style={[globalStyles.textTitle, globalStyles.marginB12, { color: colors.text }]}>
        Connections
      </Text>
      <FlatList
        data={visibleUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onUserPress(item._id)}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name}'s profile`}
            style={[globalStyles.flexAlignItemsCenter, globalStyles.marginR16]}
          >
            {item.profilePic && isValidImageUri(item.profilePic) ? (
              <Image
                source={{ uri: item.profilePic }}
                style={[globalStyles.avatarCircle, { backgroundColor: colors.regC }]}
              />
            ) : (
              <View style={[globalStyles.avatarCircle, { backgroundColor: colors.regC }]} />
            )}
            <Text
              style={[globalStyles.labelText, globalStyles.marginT4, globalStyles.textCenter, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        ListFooterComponent={
          overflowCount > 0 ? (
            <View style={[globalStyles.flexAlignItemsCenter, globalStyles.flexJustifyContentCenter, globalStyles.avatarCircle]}>
              <View
                style={[globalStyles.avatarCircle, globalStyles.flexAlignItemsCenter, globalStyles.flexJustifyContentCenter, { backgroundColor: colors.regC }]}
              >
                <Text style={[globalStyles.bold, { color: colors.priT }]}>
                  +{overflowCount}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}
