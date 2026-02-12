import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useConnections } from "@/hooks/useConnections";
import type { ConnectionUser } from "@/types/connection";

export default function ConnectedUsersScreen() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const { connections, pendingRequests, loading, error, refetch } =
    useConnections();

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/(social)/${userId}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ConnectionUser }) => (
      <Pressable
        onPress={() => handleUserPress(item._id)}
        accessibilityLabel={`View ${item.name}'s profile`}
        accessibilityRole="button"
        style={[
          globalStyles.flexRow,
          globalStyles.padding,
          { borderBottomWidth: 1, borderBottomColor: colors.triC },
        ]}
      >
        <View style={[globalStyles.avatarCircle, { backgroundColor: colors.secC }]} />
        <View style={globalStyles.marginL12}>
          <Text style={[globalStyles.textTitle, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[globalStyles.marginT4, { color: colors.triT }]}>
            @{item.username}
          </Text>
          {item.business?.industry ? (
            <Text style={[globalStyles.labelText, { color: colors.secT }]}>
              {item.business.industry}
            </Text>
          ) : null}
        </View>
      </Pressable>
    ),
    [colors, handleUserPress]
  );

  if (loading) {
    return (
      <View
        style={[globalStyles.centerItem, { backgroundColor: colors.background }]}
        accessibilityLabel="Loading connections"
      >
        <ActivityIndicator size="large" color={colors.priC} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Failed to load connections</Text>
      </View>
    );
  }

  if (connections.length === 0) {
    return (
      <View style={[globalStyles.centerItem, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No connections yet</Text>
      </View>
    );
  }

  const pendingCount = pendingRequests.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {pendingCount > 0 && (
        <View style={[globalStyles.padding, { backgroundColor: colors.secC }]}>
          <Text style={{ color: colors.secT }}>
            {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
          </Text>
        </View>
      )}
      <FlatList
        data={connections}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        accessibilityLabel="Connections list"
        refreshing={loading}
        onRefresh={refetch}
      />
    </View>
  );
}
