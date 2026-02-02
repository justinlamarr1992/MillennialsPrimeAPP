import React from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import ProfilePicture from "./ProfilePicture";
import { ServerUserProfile } from "@/types/UserProfile";

type ConnectionStatus = "none" | "pending" | "connected";

export interface ProfileHeaderProps {
  user: ServerUserProfile;
  isOwnProfile: boolean;
  onEditPress?: () => void;
  onConnectPress?: () => void;
  onImageSelected?: (uri: string) => void;
  isUploading?: boolean;
  connectionStatus?: ConnectionStatus;
}

// Pure helper functions
const getLocationString = (location?: ServerUserProfile["location"]): string => {
  if (!location) return "Location not set";

  const { city, state, country } = location;
  const parts = [city, state, country]
    .filter((part): part is string => typeof part === "string" && part.trim() !== "");

  return parts.length > 0 ? parts.join(", ") : "Location not set";
};

const getDisplayName = (user: ServerUserProfile): string => {
  if (user.name && user.name.trim() !== "") return user.name;
  if (user.username && user.username.trim() !== "") return user.username;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (fullName !== "") return fullName;

  return "User";
};

const getConnectionButtonText = (status: ConnectionStatus): string => {
  const statusMap: Record<ConnectionStatus, string> = {
    pending: "Pending",
    connected: "Connected",
    none: "Connect",
  };

  return statusMap[status];
};

// Get post count from user data or default to 0
// Note: Requires backend to populate postsCount field
const getPostsCount = (user: ServerUserProfile): number => user.postsCount ?? 0;

// Get friends count from user data or default to 0
// Note: Requires backend to populate friendsCount field
const getFriendsCount = (user: ServerUserProfile): number => user.friendsCount ?? 0;

export default function ProfileHeader({
  user,
  isOwnProfile,
  onEditPress,
  onConnectPress,
  onImageSelected,
  isUploading = false,
  connectionStatus = "none",
}: ProfileHeaderProps): JSX.Element {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const renderActionButton = (): JSX.Element => {
    if (isOwnProfile) {
      return (
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.priC }]}
          onPress={onEditPress}
          testID="edit-profile-button"
        >
          <Text style={[styles.actionButtonText, { color: colors.secT }]}>
            Edit Profile
          </Text>
        </Pressable>
      );
    }

    const isConnected = connectionStatus === "connected";
    const isPending = connectionStatus === "pending";

    return (
      <Pressable
        style={[
          styles.actionButton,
          {
            backgroundColor: isConnected ? colors.quiC : isPending ? colors.regC : colors.priC,
          },
        ]}
        onPress={onConnectPress}
        disabled={isPending}
        testID="connect-button"
      >
        <Text
          style={[
            styles.actionButtonText,
            {
              color: isConnected || isPending ? colors.priT : colors.secT,
            },
          ]}
        >
          {getConnectionButtonText(connectionStatus)}
        </Text>
      </Pressable>
    );
  };

  const renderStatItem = (label: string, value: number): JSX.Element => (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.triT }]}>{label}</Text>
    </View>
  );

  const handleImageSelected = (uri: string): void => {
    if (onImageSelected) {
      onImageSelected(uri);
    }
  };

  const displayName = getDisplayName(user);
  const locationString = getLocationString(user.location);
  const postsCount = getPostsCount(user);
  const friendsCount = getFriendsCount(user);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="profile-header">
      {/* Profile Picture Section */}
      <View style={styles.profilePictureContainer}>
        <ProfilePicture
          imageUri={user.profilePic || null}
          onImageSelected={handleImageSelected}
          size={100}
          editable={isOwnProfile}
          isUploading={isUploading}
        />
      </View>

      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={[styles.userName, { color: colors.text }]} testID="user-name">
          {displayName}
        </Text>

        {user.username && user.username.trim() !== "" && (
          <Text style={[styles.userHandle, { color: colors.triT }]}>
            @{user.username}
          </Text>
        )}

        <Text style={[styles.location, { color: colors.triT }]} testID="user-location">
          {locationString}
        </Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {renderStatItem("Posts", postsCount)}
          <View style={[styles.statDivider, { backgroundColor: colors.triT }]} />
          {renderStatItem("Friends", friendsCount)}
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        {renderActionButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  profilePictureContainer: {
    marginBottom: 16,
  },
  infoContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
    minWidth: 60,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    opacity: 0.3,
  },
  actionButtonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
