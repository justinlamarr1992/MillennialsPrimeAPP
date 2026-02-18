import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import React from "react";
import UploadBox from "@/shared/Upload/UploadBox";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useUserProfile } from "@/hooks/useUserProfile";

const UploadContentScreen = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.centerItem,
          globalStyles.flexAlignItemsCenter,
          { backgroundColor: colors["background"] },
        ]}
      >
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color={colors["priC"]}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading profile"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.centerItem,
          globalStyles.flexAlignItemsCenter,
          { backgroundColor: colors["background"] },
        ]}
      >
        <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
          Something went wrong loading your profile.
        </Text>
      </View>
    );
  }

  if (!profile?.prime) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.centerItem,
          globalStyles.flexAlignItemsCenter,
          { backgroundColor: colors["background"] },
        ]}
      >
        <Text style={[globalStyles.textTitle, { color: colors["priT"] }]}>
          Content Creators Only
        </Text>
        <Text style={[globalStyles.labelText, { color: colors["priT"] }]}>
          This feature is available to Prime content creators.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        globalStyles.container,
        globalStyles.centerItem,
        globalStyles.flexAlignItemsCenter,
        { backgroundColor: colors["background"] },
      ]}
    >
      <UploadBox />
    </View>
  );
};

export default UploadContentScreen;
