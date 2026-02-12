import React from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import ProfileHeader from "@/components/ProfileHeader";
import ConnectionButton from "@/components/ConnectionButton";
import InterestSection from "@/components/InterestSection";
import B2BOpportunitySection from "@/components/B2BOpportunitySection";
import ProfileTabs from "@/components/ProfileTabs";
import { useUserProfileById } from "@/hooks/useUserProfileById";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const { profile, loading, error } = useUserProfileById(id);
  const connection = useConnectionStatus(id);

  if (loading) {
    return (
      <View
        style={[globalStyles.centerItem, { backgroundColor: colors.background }]}
        accessibilityLabel="Loading profile"
      >
        <ActivityIndicator testID="activity-indicator" size="large" color={colors.priC} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          {error ? "Failed to load profile" : "No profile data available"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <ProfileHeader user={profile} isOwnProfile={false} />

      <ConnectionButton
        status={connection.status}
        connectionId={connection.connectionId}
        loading={connection.loading}
        onSendRequest={connection.sendRequest}
        onAcceptRequest={connection.acceptRequest}
        onDeclineRequest={connection.declineRequest}
        onRemoveConnection={connection.removeConnection}
      />

      <InterestSection interests={profile.interests ?? []} />

      <B2BOpportunitySection
        b2bEnabled={profile.b2bOpportunities}
        industry={profile.business?.industry}
        b2bTags={profile.b2bOpportunityTags}
      />

      <ProfileTabs textPosts={[]} picturePosts={[]} videoPosts={[]} />
    </ScrollView>
  );
}
