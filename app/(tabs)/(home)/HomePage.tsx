import React from "react";
import {
  Text,
  View,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Pressable,
} from "react-native";

import Ad from "@/shared/Ad";
import PrimeNewsPost from "@/shared/PostComponents/PrimeNewsPost";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useBunnyCDNVideos } from "@/hooks/useBunnyCDNVideos";

export default function Page() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];
  const name = "Millennial's Prime Admin";

  // Use React Query hook for cached data fetching
  const { data: videoData, isLoading, isError, error, refetch } = useBunnyCDNVideos();

  // Show loading state
  if (isLoading) {
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: colors["background"], justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors["triC"]} />
        <Text style={{ color: colors["text"], marginTop: 16 }}>Loading latest content...</Text>
      </View>
    );
  }

  // Show error state with retry option
  if (isError) {
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: colors["background"], justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Text style={{ color: colors["secC"], fontSize: 16, textAlign: "center", marginBottom: 16 }}>
          {error instanceof Error && error.message.includes("Unable to load videos")
            ? error.message
            : "Failed to load content. Please try again later."}
        </Text>
        <Pressable
          style={[
            globalStyles.button,
            { backgroundColor: colors["triC"], paddingHorizontal: 24 }
          ]}
          onPress={() => refetch()}
        >
          <Text style={globalStyles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Show message if no video data
  if (!videoData) {
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: colors["background"], justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Text style={{ color: colors["text"], fontSize: 16, textAlign: "center" }}>
          No content available at this time.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: colors["background"] },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.padding]}>
          <PrimeNewsPost
            prime={true}
            admin={true}
            title={videoData.title}
            description={videoData.description}
            name={name}
            time={videoData.dateUploaded}
            guid={videoData.guid}
            videoLibraryId={videoData.videoLibraryId}
            dateUploaded={videoData.dateUploaded}
            url={`https://video.bunnycdn.com/embed/${videoData.videoLibraryId}/${videoData.guid}`}
            libraryId={videoData.videoLibraryId}
            videoId={videoData.guid}
          />

          {/* Timer */}
          <Ad title={"First Update"} startDate={"2024-08-22T08:00:00.493Z"} />
        </View>
      </ScrollView>
    </View>
  );
}
