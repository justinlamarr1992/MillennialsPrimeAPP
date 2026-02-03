import { ScrollView, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";
import type { TextPost, PicturePost, VideoPost } from "@/types/posts";

export default function MyProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Fetch user profile data
  const { profile, loading, error } = useUserProfile();
  const { profileImageUri, handleImageSelected, isUploading } = useProfilePictureUpload();

  // Handle Edit Profile navigation
  const handleEditProfile = (): void => {
    // TODO: Navigate to edit profile screen when created (Phase 1.4)
    console.log("Edit Profile pressed - navigation to be implemented");
  };

  // Mock posts data - memoized to prevent unnecessary re-renders of ProfileTabs
  // These hooks must be called before any conditional returns (React hooks rules)
  // TODO: Replace with actual user posts from API when backend is ready (tracked in issue #46)
  // Fixed timestamp to ensure consistent mock data
  const MOCK_TIMESTAMP = "2026-02-02T12:00:00.000Z";

  const mockTextPosts = useMemo<TextPost[]>(
    () =>
      profile
        ? [
            {
              id: "1",
              type: "text",
              title: "Testing the Title for the User Profile Post",
              description: "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines",
              authorName: profile.username,
              authorId: profile._id,
              isPrime: profile.prime ?? false,
              isAdmin: false,
              createdAt: MOCK_TIMESTAMP,
              likeCount: 0,
              commentCount: 0,
            },
          ]
        : [],
    [profile]
  );

  const mockPicturePosts = useMemo<PicturePost[]>(
    () =>
      profile
        ? [
            {
              id: "2",
              type: "picture",
              title: "Test Picture Post",
              description: "This is where the description of the post will go, but it will be shortened to only two lines max...",
              authorName: profile.username,
              authorId: profile._id,
              imageUrl: "https://via.placeholder.com/600x400.png?text=Picture+Post",
              isPrime: profile.prime ?? false,
              isAdmin: false,
              createdAt: MOCK_TIMESTAMP,
              likeCount: 0,
              commentCount: 0,
            },
          ]
        : [],
    [profile]
  );

  const mockVideoPosts = useMemo<VideoPost[]>(
    () =>
      profile
        ? [
            {
              id: "3",
              type: "video",
              title: "This is a Video Post Title",
              description: "This is where the description of the post will go, but it will be shortened to only two lines max...",
              authorName: profile.username,
              authorId: profile._id,
              videoId: "ec4cbe34-8750-4695-b252-69f53e51627a",
              isPrime: profile.prime ?? false,
              isAdmin: false,
              createdAt: MOCK_TIMESTAMP,
              likeCount: 0,
              commentCount: 0,
            },
          ]
        : [],
    [profile]
  );

  // Show loading state
  if (loading) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.priC} />
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

      {/* ProfileTabs - Phase 1.3 */}
      <ProfileTabs
        textPosts={mockTextPosts}
        picturePosts={mockPicturePosts}
        videoPosts={mockVideoPosts}
      />
    </ScrollView>
  );
}
