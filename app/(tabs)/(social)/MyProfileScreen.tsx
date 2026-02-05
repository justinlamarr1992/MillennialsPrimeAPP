import { ScrollView, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import { router } from "expo-router";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";
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
    >
      {/* ProfileHeader - Phase 1 */}
      <ProfileHeader
        user={displayProfile}
        isOwnProfile={true}
        onEditPress={handleEditProfile}
        onImageSelected={handleImageSelected}
        isUploading={isUploading}
      />

      {/* ProfileTabs - Phase 1.3 with Phase 1.5 real data integration */}
      <ProfileTabs
        textPosts={textPosts}
        picturePosts={picturePosts}
        videoPosts={videoPosts}
      />
    </ScrollView>
  );
}
