/**
 * ProfileTabs Component
 *
 * Displays tabbed navigation for filtering profile content by type:
 * - Posts (text posts)
 * - Photos (picture posts)
 * - Videos (video posts)
 *
 * Features:
 * - Tab switching with visual feedback
 * - Content filtering based on active tab
 * - Empty state handling
 * - Accessibility support
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";
import TextPost from "@/shared/PostComponents/TextPost";
import PicturePost from "@/shared/PostComponents/PicturePost";
import VideoPost from "@/shared/PostComponents/VideoPost";
import {
  MockTextPost,
  MockPicturePost,
  MockVideoPost,
} from "../__tests__/factories/mockDataFactory";

type TabType = "posts" | "photos" | "videos";

interface ProfileTabsProps {
  textPosts: MockTextPost[];
  picturePosts: MockPicturePost[];
  videoPosts: MockVideoPost[];
}

// Pure helper functions

/**
 * Get the label for a tab type
 */
const getTabLabel = (tab: TabType): string => {
  const labels: Record<TabType, string> = {
    posts: "Posts",
    photos: "Photos",
    videos: "Videos",
  };
  return labels[tab];
};

/**
 * Get the appropriate empty message for a tab type
 */
const getEmptyMessage = (tab: TabType): string => {
  const messages: Record<TabType, string> = {
    posts: "No posts yet",
    photos: "No photos yet",
    videos: "No videos yet",
  };
  return messages[tab];
};

/**
 * Check if a tab has content
 */
const hasContent = (tab: TabType, props: ProfileTabsProps): boolean => {
  const contentMap: Record<TabType, unknown[]> = {
    posts: props.textPosts,
    photos: props.picturePosts,
    videos: props.videoPosts,
  };
  return contentMap[tab].length > 0;
};


export default function ProfileTabs({
  textPosts,
  picturePosts,
  videoPosts,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  const tabs: TabType[] = ["posts", "photos", "videos"];
  const props = { textPosts, picturePosts, videoPosts };

  /**
   * Render a single tab button
   */
  const renderTab = (tab: TabType) => {
    const isActive = activeTab === tab;
    return (
      <Pressable
        key={tab}
        onPress={() => setActiveTab(tab)}
        style={[
          styles.tab,
          isActive && { ...styles.activeTab, borderBottomColor: colors.priC },
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <Text
          style={[
            styles.tabText,
            { color: isActive ? colors.priC : colors.text },
          ]}
        >
          {getTabLabel(tab)}
        </Text>
      </Pressable>
    );
  };

  /**
   * Render empty state message
   */
  const renderEmptyState = (tab: TabType) => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {getEmptyMessage(tab)}
      </Text>
    </View>
  );

  /**
   * Render text posts
   */
  const renderTextPosts = () => {
    if (!hasContent("posts", props)) {
      return renderEmptyState("posts");
    }

    return textPosts.map((post) => (
      <TextPost
        key={post.id}
        name={post.authorName}
        title={post.title}
        description={post.description}
        prime={post.isPrime ?? false}
        admin={post.isAdmin ?? false}
        authorId={post.authorId}
      />
    ));
  };

  /**
   * Render picture posts
   */
  const renderPicturePosts = () => {
    if (!hasContent("photos", props)) {
      return renderEmptyState("photos");
    }

    return picturePosts.map((post) => (
      <PicturePost
        key={post.id}
        name={post.authorName}
        title={post.title}
        description={post.description}
        picture={post.imageUrl}
        prime={post.isPrime ?? false}
        admin={post.isAdmin ?? false}
        authorId={post.authorId}
      />
    ));
  };

  /**
   * Render video posts
   */
  const renderVideoPosts = () => {
    if (!hasContent("videos", props)) {
      return renderEmptyState("videos");
    }

    return videoPosts.map((post) => (
      <VideoPost
        key={post.id}
        name={post.authorName}
        title={post.title}
        description={post.description}
        prime={post.isPrime ?? false}
        admin={post.isAdmin ?? false}
        libraryId={147838} // Default library ID
        videoId={post.videoUrl} // Using videoUrl as videoId for now
        authorId={post.authorId}
      />
    ));
  };

  /**
   * Render content based on active tab
   */
  const renderContent = () => {
    const contentRenderers: Record<TabType, () => React.ReactNode> = {
      posts: renderTextPosts,
      photos: renderPicturePosts,
      videos: renderVideoPosts,
    };

    return contentRenderers[activeTab]();
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: colors.gray }]}>
        {tabs.map(renderTab)}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
