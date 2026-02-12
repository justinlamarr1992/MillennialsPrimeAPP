import { ScrollView, Pressable, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import { router } from "expo-router";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import MetricsDashboard from "@/components/MetricsDashboard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";
import { useConnections } from "@/hooks/useConnections";
import type { Metric } from "@/components/MetricsDashboard";
import type { TextPost, PicturePost, VideoPost } from "@/types/posts";

export default function MyProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Fetch user profile data
  const { profile, loading, error } = useUserProfile();
  const { profileImageUri, handleImageSelected, isUploading } = useProfilePictureUpload();

  // Fetch user posts data (Phase 1.5)
  // Backend API not yet implemented - will return empty until /posts endpoints are deployed
  // Note: _postsLoading and _postsError prefixed with _ as they're reserved for future use
  const { posts, loading: _postsLoading, error: _postsError } = useUserPosts();

  // Fetch connections data (Phase 2)
  const { connections, pendingRequests } = useConnections();

  const metrics = useMemo<Metric[]>(
    () => [
      { label: "Connections", value: connections.length, icon: "people-outline" },
      { label: "Pending", value: pendingRequests.length, icon: "time-outline" },
    ],
    [connections.length, pendingRequests.length]
  );

  // Handle Edit Profile navigation
  const handleEditProfile = (): void => {
    router.push("/(tabs)/(social)/EditProfileScreen");
  };

  // Filter posts by type for ProfileTabs component
  // Memoized to prevent unnecessary re-renders
  const textPosts = useMemo<TextPost[]>(
    () => posts.filter((post) => post.type === "text") as TextPost[],
    [posts]
  );

  const picturePosts = useMemo<PicturePost[]>(
    () => posts.filter((post) => post.type === "picture") as PicturePost[],
    [posts]
  );

  const videoPosts = useMemo<VideoPost[]>(
    () => posts.filter((post) => post.type === "video") as VideoPost[],
    [posts]
  );

  // Show loading state
  if (loading) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <ActivityIndicator testID="activity-indicator" size="large" color={colors.priC} />
      </View>
    );
  }

  // Show error state
  if (error || !profile) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          {error ? "Failed to load profile" : "No profile data available"}
        </Text>
      </View>
    );
  }

  // Use profileImageUri from hook if available, otherwise use profile.profilePic
  const displayProfile = {
    ...profile,
    profilePic: profileImageUri || profile.profilePic,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* ProfileHeader - Phase 1 */}
      <ProfileHeader
        user={displayProfile}
        isOwnProfile={true}
        onEditPress={handleEditProfile}
        onImageSelected={handleImageSelected}
        isUploading={isUploading}
      />

      {/* Connections link - Phase 2 */}
      <Pressable
        onPress={() => router.push("/(tabs)/(social)/ConnectedUsersScreen")}
        accessibilityLabel="View connections"
        accessibilityRole="button"
        style={[globalStyles.padding, globalStyles.flexRow, { justifyContent: "space-between" }]}
      >
        <Text style={[globalStyles.textTitle, { color: colors.text }]}>
          {connections.length} Connections
        </Text>
        <Text style={{ color: colors.triT }}>View all</Text>
      </Pressable>

      {/* MetricsDashboard - Phase 2 */}
      <MetricsDashboard metrics={metrics} />

      {/* ProfileTabs - Phase 1.3 with Phase 1.5 real data integration */}
      <ProfileTabs
        textPosts={textPosts}
        picturePosts={picturePosts}
        videoPosts={videoPosts}
      />
    </ScrollView>
  );
}
