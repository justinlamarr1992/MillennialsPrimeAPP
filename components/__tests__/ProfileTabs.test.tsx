/**
 * ProfileTabs Component - Behavioral Tests
 *
 * These tests verify user-facing behavior, not implementation details.
 * Focus: What users see and experience, not how the component works internally.
 *
 * Test Philosophy:
 * - Tests describe user scenarios, not component internals
 * - Tests verify visual output and interactions
 * - Tests avoid implementation details (state, methods, etc.)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileTabs from "../ProfileTabs";
import type {
  TextPost,
  PicturePost,
  VideoPost,
} from "@/types/posts";

// Helper functions to create mock posts for testing
const createMockTextPost = (overrides?: Partial<TextPost>): TextPost => ({
  id: "post-123",
  type: "text",
  title: "Test Post Title",
  description: "This is a test post description",
  authorId: "user-123",
  authorName: "John Doe",
  createdAt: "2026-01-26T12:00:00Z",
  likeCount: 10,
  commentCount: 5,
  isPrime: false,
  isAdmin: false,
  ...overrides,
});

const createMockPicturePost = (overrides?: Partial<PicturePost>): PicturePost => ({
  ...createMockTextPost(),
  type: "picture",
  imageUrl: "https://example.com/image.jpg",
  ...overrides,
});

const createMockVideoPost = (overrides?: Partial<VideoPost>): VideoPost => ({
  ...createMockTextPost(),
  type: "video",
  videoId: "video-123",
  ...overrides,
});

// Mock post components to verify they render correctly
jest.mock("@/shared/PostComponents/TextPost", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockTextPost({ title }: { title: string }) {
    return <Text testID="text-post">{title}</Text>;
  };
});

jest.mock("@/shared/PostComponents/PicturePost", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockPicturePost({ title }: { title: string }) {
    return <Text testID="picture-post">{title}</Text>;
  };
});

jest.mock("@/shared/PostComponents/VideoPost", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return function MockVideoPost({ title }: { title: string }) {
    return <Text testID="video-post">{title}</Text>;
  };
});

describe("ProfileTabs Component - Behavioral Tests", () => {
  // Sample data for tests
  const mockTextPosts: TextPost[] = [
    createMockTextPost({ id: "text-1", title: "Text Post 1" }),
    createMockTextPost({ id: "text-2", title: "Text Post 2" }),
  ];

  const mockPicturePosts: PicturePost[] = [
    createMockPicturePost({ id: "pic-1", title: "Picture Post 1" }),
    createMockPicturePost({ id: "pic-2", title: "Picture Post 2" }),
  ];

  const mockVideoPosts: VideoPost[] = [
    createMockVideoPost({ id: "vid-1", title: "Video Post 1" }),
    createMockVideoPost({ id: "vid-2", title: "Video Post 2" }),
  ];

  describe("Given a user views their profile with posts", () => {
    it("should display three tab options: Posts, Photos, and Videos", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      expect(getByText("Posts")).toBeTruthy();
      expect(getByText("Photos")).toBeTruthy();
      expect(getByText("Videos")).toBeTruthy();
    });

    it("should have the Posts tab active by default", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      // Verify Posts tab content is displayed by default
      expect(getByText("Text Post 1")).toBeTruthy();
      expect(getByText("Posts")).toBeTruthy();
    });

    it("should display text posts when Posts tab is active", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      expect(getByText("Text Post 1")).toBeTruthy();
      expect(getByText("Text Post 2")).toBeTruthy();
    });

    it("should display the correct number of text posts", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      // Verify both posts are rendered
      expect(getByText("Text Post 1")).toBeTruthy();
      expect(getByText("Text Post 2")).toBeTruthy();
    });
  });

  describe("When a user switches to the Photos tab", () => {
    it("should display only picture posts", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Photos"));

      expect(getByText("Picture Post 1")).toBeTruthy();
      expect(getByText("Picture Post 2")).toBeTruthy();
    });

    it("should not display text posts", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Photos"));

      expect(queryByText("Text Post 1")).toBeNull();
      expect(queryByText("Text Post 2")).toBeNull();
    });

    it("should display the correct number of picture posts", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Photos"));

      // Verify both picture posts are rendered
      expect(getByText("Picture Post 1")).toBeTruthy();
      expect(getByText("Picture Post 2")).toBeTruthy();
    });
  });

  describe("When a user switches to the Videos tab", () => {
    it("should display only video posts", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Videos"));

      expect(getByText("Video Post 1")).toBeTruthy();
      expect(getByText("Video Post 2")).toBeTruthy();
    });

    it("should not display text or picture posts", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Videos"));

      expect(queryByText("Text Post 1")).toBeNull();
      expect(queryByText("Picture Post 1")).toBeNull();
    });

    it("should display the correct number of video posts", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Videos"));

      // Verify both video posts are rendered
      expect(getByText("Video Post 1")).toBeTruthy();
      expect(getByText("Video Post 2")).toBeTruthy();
    });
  });

  describe("Given a user has no posts", () => {
    it("should display a message indicating no posts are available", () => {
      const { getByText } = render(<ProfileTabs textPosts={[]} picturePosts={[]} videoPosts={[]} />);

      expect(getByText(/no posts/i)).toBeTruthy();
    });

    it("should not display any post components", () => {
      const { queryByText } = render(<ProfileTabs textPosts={[]} picturePosts={[]} videoPosts={[]} />);

      // Verify no posts are displayed (only the empty message)
      expect(queryByText("Text Post 1")).toBeNull();
      expect(queryByText("Picture Post 1")).toBeNull();
      expect(queryByText("Video Post 1")).toBeNull();
    });
  });

  describe("Given a user has no photos", () => {
    it("should display a message when Photos tab is selected", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={[]}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Photos"));

      expect(getByText(/no photos/i)).toBeTruthy();
    });

    it("should not display any picture post components", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={[]}
          videoPosts={mockVideoPosts}
        />
      );

      fireEvent.press(getByText("Photos"));

      // Verify no picture posts are displayed
      expect(queryByText("Picture Post 1")).toBeNull();
    });
  });

  describe("Given a user has no videos", () => {
    it("should display a message when Videos tab is selected", () => {
      const { getByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={[]}
        />
      );

      fireEvent.press(getByText("Videos"));

      expect(getByText(/no videos/i)).toBeTruthy();
    });

    it("should not display any video post components", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={[]}
        />
      );

      fireEvent.press(getByText("Videos"));

      // Verify no video posts are displayed
      expect(queryByText("Video Post 1")).toBeNull();
    });
  });

  describe("When a user switches between tabs multiple times", () => {
    it("should correctly switch from Posts to Photos to Videos", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      // Start on Posts
      expect(getByText("Text Post 1")).toBeTruthy();

      // Switch to Photos
      fireEvent.press(getByText("Photos"));
      expect(getByText("Picture Post 1")).toBeTruthy();
      expect(queryByText("Text Post 1")).toBeNull();

      // Switch to Videos
      fireEvent.press(getByText("Videos"));
      expect(getByText("Video Post 1")).toBeTruthy();
      expect(queryByText("Picture Post 1")).toBeNull();
    });

    it("should correctly switch back to Posts after viewing other tabs", () => {
      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={mockTextPosts}
          picturePosts={mockPicturePosts}
          videoPosts={mockVideoPosts}
        />
      );

      // Go to Photos
      fireEvent.press(getByText("Photos"));
      expect(getByText("Picture Post 1")).toBeTruthy();

      // Go to Videos
      fireEvent.press(getByText("Videos"));
      expect(getByText("Video Post 1")).toBeTruthy();

      // Go back to Posts
      fireEvent.press(getByText("Posts"));
      expect(getByText("Text Post 1")).toBeTruthy();
      expect(queryByText("Video Post 1")).toBeNull();
    });
  });

  describe("Given a user has a mix of content across tabs", () => {
    it("should maintain separate counts for each content type", () => {
      const oneTextPost = [createMockTextPost({ id: "1", title: "Only Text Post" })];
      const threePicturePosts = [
        createMockPicturePost({ id: "1", title: "Picture 1" }),
        createMockPicturePost({ id: "2", title: "Picture 2" }),
        createMockPicturePost({ id: "3", title: "Picture 3" }),
      ];
      const twoVideoPosts = [
        createMockVideoPost({ id: "1", title: "Video 1" }),
        createMockVideoPost({ id: "2", title: "Video 2" }),
      ];

      const { getByText, queryByText } = render(
        <ProfileTabs
          textPosts={oneTextPost}
          picturePosts={threePicturePosts}
          videoPosts={twoVideoPosts}
        />
      );

      // Posts tab - 1 post
      expect(getByText("Only Text Post")).toBeTruthy();

      // Photos tab - 3 posts
      fireEvent.press(getByText("Photos"));
      expect(getByText("Picture 1")).toBeTruthy();
      expect(getByText("Picture 2")).toBeTruthy();
      expect(getByText("Picture 3")).toBeTruthy();
      expect(queryByText("Only Text Post")).toBeNull();

      // Videos tab - 2 posts
      fireEvent.press(getByText("Videos"));
      expect(getByText("Video 1")).toBeTruthy();
      expect(getByText("Video 2")).toBeTruthy();
      expect(queryByText("Picture 1")).toBeNull();
    });
  });

});
