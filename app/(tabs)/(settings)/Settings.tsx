import {
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useProfilePictureUpload } from "@/hooks/useProfilePictureUpload";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import ProfilePicture from "@/components/ProfilePicture";

export default function Page() {
  const { user, loading } = useAuth();
  useAxiosPrivate(); // Set up axios interceptors for authenticated requests
  const { profileImageUri, handleImageSelected } = useProfilePictureUpload();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (loading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.flexJustifyContentCenter,
          globalStyles.flexAlignItemsCenter,
          { backgroundColor: colors["background"] },
        ]}
      >
        <ActivityIndicator size="large" color={colors["priC"]} />
      </View>
    );
  }

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.padding, { backgroundColor: colors["background"] }]}
    >
      <View style={globalStyles.formTitle}>
        <ProfilePicture
          imageUri={profileImageUri}
          onImageSelected={handleImageSelected}
          size={120}
          editable={true}
        />
        <Text style={[globalStyles.textTitle, { color: colors["text"], marginTop: 16 }]}>
          Settings
        </Text>
        <Text style={[globalStyles.textMedium, { color: colors["secC"], marginTop: 8 }]}>
          Hello, {displayName}
        </Text>
        {user?.email && (
          <Text style={[globalStyles.labelText, { color: colors["secC"], marginTop: 4 }]}>
            {user.email}
          </Text>
        )}
      </View>
      <Pressable
        onPress={() => router.push("/(tabs)/(settings)/MyInfoScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Personal Information
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/(tabs)/(settings)/BusinessScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Business Information
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/(tabs)/(settings)/ArtScreen")}
        style={[
          globalStyles.button,
          globalStyles.marginVertical,
          { backgroundColor: colors["priC"] },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: colors["secT"] }]}>
          Artistry Information
        </Text>
      </Pressable>
    </ScrollView>
  );
}
