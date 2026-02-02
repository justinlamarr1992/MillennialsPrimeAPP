import { ScrollView, useColorScheme, View, Text, ActivityIndicator } from "react-native";
import React from "react";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import VideoPost from "@/shared/PostComponents/VideoPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import TextPost from "@/shared/PostComponents/TextPost";
import ProfileHeader from "@/components/ProfileHeader";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";

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

  // NOTE: Hardcoded values for post components
  // These will be replaced with actual user posts in Phase 1.3 (ProfileTabs)
  const admin = false;
  const prime = profile.prime ?? false;
  const id = profile._id;

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

      {/* Existing test posts - will be replaced with ProfileTabs in Phase 1.3 */}
      <View style={globalStyles.padding}>
        <TextPost
        name={"Test User"}
        title={"Testing the Title for the User Profile Post"}
        description={
          "This is where the description of the text Post will go, but it will be however long the user types... However we may need to restrict this by a maximum of 10 lines"
        }
        prime={prime}
        admin={admin}
        authorId={id}
      />
      <PicturePost
        name={"Test User"}
        title={"Test"}
        description={
          "This is where the description of the post will go, but it will be shortened to only two lines max..."
        }
        picture=""
        prime={prime}
        admin={admin}
        authorId={id}
      />
      <VideoPost
        name={"Test User"}
        title={"This is a Video Post Title"}
        description={
          "This is where the description of the post will go, but it will be shortened to only two lines max..."
        }
        prime={prime}
        admin={admin}
        libraryId={147838}
        videoId={"ec4cbe34-8750-4695-b252-69f53e51627a"}
        authorId={id}
      />
      </View>
    </ScrollView>
  );
}
