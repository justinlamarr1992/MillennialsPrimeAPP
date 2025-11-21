import React from "react";
import {
  Text,
  View,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";

import { globalStyles } from "@/constants/global";
import { COLORS } from "@/constants/Colors";
import { useBunnyCDNVideos, VideoData } from "@/hooks/useBunnyCDNVideos";
import ContentCarousel from "@/components/ContentCarousel";
import ContentCard from "@/components/ContentCard";
import PrimeNewsPost from "@/shared/PostComponents/PrimeNewsPost";
import Ad from "@/shared/Ad";

/**
 * Pure function to split videos into HBO-style sections
 *
 * @pure Deterministic output based on input, no side effects
 */
const createVideoSections = (videos: VideoData[]) => ({
  featured: videos[0] ?? null,
  newEpisodes: videos.slice(1, 4),
  popular: videos.slice(4, 7),
  recommended: videos.slice(7, 10),
});

export default function Page() {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  // Fetch multiple videos for HBO-style sections
  const { data: videos, isLoading, isError, error, refetch } = useBunnyCDNVideos();

  // Show loading state
  if (isLoading) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.flexJustifyContentCenter,
          globalStyles.flexAlignItemsCenter,
          { backgroundColor: colors["background"] },
        ]}
      >
        <ActivityIndicator size="large" color={colors["triC"]} />
        <Text style={[globalStyles.textCenter, { marginTop: 16, color: colors["text"] }]}>
          Loading latest content...
        </Text>
      </View>
    );
  }

  // Show error state with retry option
  if (isError) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.flexJustifyContentCenter,
          globalStyles.flexAlignItemsCenter,
          globalStyles.padding,
          { backgroundColor: colors["background"] },
        ]}
      >
        <Text style={[globalStyles.textCenter, { marginBottom: 16, color: colors["secC"], fontSize: 16 }]}>
          {error instanceof Error && error.message.includes("Unable to load videos")
            ? error.message
            : "Failed to load content. Please try again later."}
        </Text>
        <Pressable
          style={[
            globalStyles.button,
            { backgroundColor: colors["triC"] }
          ]}
          onPress={() => refetch()}
        >
          <Text style={globalStyles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Show message if no video data
  if (!videos || videos.length === 0) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.flexJustifyContentCenter,
          globalStyles.flexAlignItemsCenter,
          globalStyles.padding,
          { backgroundColor: colors["background"] },
        ]}
      >
        <Text style={[globalStyles.textCenter, { color: colors["text"], fontSize: 16 }]}>
          No content available at this time.
        </Text>
      </View>
    );
  }

  // Create HBO-style sections from videos
  const sections = createVideoSections(videos);

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: colors["background"] },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured/Hero Video */}
        {sections.featured && (
          <View style={[globalStyles.padding]}>
            <PrimeNewsPost
              prime={true}
              admin={true}
              title={sections.featured.title}
              description={sections.featured.description}
              guid={sections.featured.guid}
              videoLibraryId={sections.featured.videoLibraryId}
            />
          </View>
        )}

        {/* New Episodes Section */}
        {sections.newEpisodes.length > 0 && (
          <ContentCarousel title="New Episodes" showBadge badgeText="New">
            {sections.newEpisodes.map((video, index) => (
              <ContentCard
                key={`new-episodes-${video.guid}-${index}`}
                title={video.title}
                description={video.description}
                dateUploaded={video.dateUploaded}
                isPrime={index === 0}
                showNewBadge={index === 0}
                showMenu
              />
            ))}
          </ContentCarousel>
        )}

        {/* Popular Content Section */}
        {sections.popular.length > 0 && (
          <ContentCarousel title="Popular">
            {sections.popular.map((video, index) => (
              <ContentCard
                key={`popular-${video.guid}-${index}`}
                title={video.title}
                description={video.description}
                dateUploaded={video.dateUploaded}
                showMenu
              />
            ))}
          </ContentCarousel>
        )}

        {/* Recommended Section */}
        {sections.recommended.length > 0 && (
          <ContentCarousel title="Recommended for You">
            {sections.recommended.map((video, index) => (
              <ContentCard
                key={`recommended-${video.guid}-${index}`}
                title={video.title}
                description={video.description}
                dateUploaded={video.dateUploaded}
                isPrime={index === 0}
                showMenu
              />
            ))}
          </ContentCarousel>
        )}

        {/* Timer/Ad */}
        <View style={[globalStyles.padding]}>
          <Ad title={"First Update"} startDate={"2024-08-22T08:00:00.493Z"} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
});
