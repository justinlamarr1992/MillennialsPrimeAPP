import React from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";

export default function SocialFeedScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  return (
    <View style={[globalStyles.centerItem, globalStyles.flexAlignItemsCenter, { backgroundColor: colors.background }]}>
      <Text style={[globalStyles.textTitle, { color: colors.text, fontSize: 28 }]}>
        Social
      </Text>

      <View style={[globalStyles.padding, globalStyles.gap12, { width: "100%", maxWidth: 400 }]}>
        <Pressable
          onPress={() => router.push("/(tabs)/(social)/MyProfileScreen")}
          accessibilityLabel="Go to My Profile"
          accessibilityRole="button"
          style={[
            globalStyles.flexRow,
            globalStyles.padding,
            globalStyles.gap12,
            { backgroundColor: colors.secC, borderRadius: 12, alignItems: "center" },
          ]}
        >
          <Ionicons name="person-outline" size={24} color={colors.priC} />
          <View>
            <Text style={[globalStyles.textTitle, { color: colors.text }]}>My Profile</Text>
            <Text style={[globalStyles.labelText, { color: colors.triT }]}>
              View and edit your profile
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/(social)/ConnectedUsersScreen")}
          accessibilityLabel="Go to Connections"
          accessibilityRole="button"
          style={[
            globalStyles.flexRow,
            globalStyles.padding,
            globalStyles.gap12,
            { backgroundColor: colors.secC, borderRadius: 12, alignItems: "center" },
          ]}
        >
          <Ionicons name="people-outline" size={24} color={colors.priC} />
          <View>
            <Text style={[globalStyles.textTitle, { color: colors.text }]}>Connections</Text>
            <Text style={[globalStyles.labelText, { color: colors.triT }]}>
              View your connections
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={[globalStyles.padding, { alignItems: "center" }]}>
        <Text style={{ color: colors.triT }}>Coming Soon</Text>
        <Text style={[globalStyles.labelText, { color: colors.triT }]}>
          Social feed with posts from your connections
        </Text>
      </View>
    </View>
  );
}
