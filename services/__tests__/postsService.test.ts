/**
 * Tests for postsService
 * Following TDD approach - tests written before backend implementation
 *
 * These tests define the expected API contract for when backend is ready.
 * Backend implementation tracked in: GitHub Issue #46
 */

// Mock dependencies BEFORE imports
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock("@/API/axios", () => ({
  axiosPrivate: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/services/serverAuth");
jest.mock("@/utils/logger");

import { postsService } from "../postsService";
import type { UserPostsResponse } from "../postsService";
import { serverAuth } from "../serverAuth";
import { axiosPrivate } from "@/API/axios";
import type { Post, TextPost, PicturePost, VideoPost } from "@/types/posts";

describe("postsService", () => {
  const mockUserId = "user-123-abc";
  const mockedAxiosPrivate = axiosPrivate as jest.Mocked<typeof axiosPrivate>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(serverAuth, "getUserId").mockResolvedValue(mockUserId);
  });

  describe("fetchUserPosts", () => {
    it("fetches current user's posts successfully", async () => {
      const mockTextPost: TextPost = {
        id: "post-1",
        type: "text",
        title: "Test Post",
        description: "This is a test post",
        authorName: "testuser",
        authorId: mockUserId,
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-05T12:00:00.000Z",
        likeCount: 5,
        commentCount: 2,
      };

      const mockPicturePost: PicturePost = {
        id: "post-2",
        type: "picture",
        title: "Picture Post",
        description: "A picture post",
        authorName: "testuser",
        authorId: mockUserId,
        imageUrl: "https://example.com/image.jpg",
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-04T12:00:00.000Z",
        likeCount: 10,
        commentCount: 3,
      };

      const mockVideoPost: VideoPost = {
        id: "post-3",
        type: "video",
        title: "Video Post",
        description: "A video post",
        authorName: "testuser",
        authorId: mockUserId,
        videoId: "ec4cbe34-8750-4695-b252-69f53e51627a",
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-03T12:00:00.000Z",
        likeCount: 15,
        commentCount: 7,
      };

      const mockResponse: UserPostsResponse = {
        posts: [mockTextPost, mockPicturePost, mockVideoPost],
        totalCount: 3,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.get).toHaveBeenCalledWith("/posts/profile");
      expect(result).toEqual(mockResponse);
      expect(result.posts).toHaveLength(3);
      expect(result.totalCount).toBe(3);
    });

    it("returns empty posts array when user has no posts", async () => {
      const mockResponse: UserPostsResponse = {
        posts: [],
        totalCount: 0,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.get).toHaveBeenCalledWith("/posts/profile");
      expect(result.posts).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it("throws error when user ID not found", async () => {
      jest.spyOn(serverAuth, "getUserId").mockResolvedValue(null);

      await expect(postsService.fetchUserPosts()).rejects.toThrow("User ID not found");
      expect(axiosPrivate.get).not.toHaveBeenCalled();
    });

    it("handles server errors correctly", async () => {
      const mockError = new Error("Server error");
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(postsService.fetchUserPosts()).rejects.toThrow("Server error");
      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(axiosPrivate.get).toHaveBeenCalledWith("/posts/profile");
    });

    it("handles 404 not found errors", async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: "Posts not found" },
        },
        message: "Request failed with status code 404",
      };
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(postsService.fetchUserPosts()).rejects.toEqual(mockError);
    });

    it("handles 500 server errors", async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: "Internal server error" },
        },
        message: "Request failed with status code 500",
      };
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(postsService.fetchUserPosts()).rejects.toEqual(mockError);
    });
  });

  describe("fetchPostsByUserId", () => {
    const otherUserId = "user-456-def";

    it("fetches posts for specified user successfully", async () => {
      const mockPost: TextPost = {
        id: "post-1",
        type: "text",
        title: "Other User Post",
        description: "Post from another user",
        authorName: "otheruser",
        authorId: otherUserId,
        isPrime: true,
        isAdmin: false,
        createdAt: "2026-02-05T12:00:00.000Z",
        likeCount: 20,
        commentCount: 5,
      };

      const mockResponse: UserPostsResponse = {
        posts: [mockPost],
        totalCount: 1,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchPostsByUserId(otherUserId);

      expect(axiosPrivate.get).toHaveBeenCalledWith(`/posts/${otherUserId}`);
      expect(result).toEqual(mockResponse);
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].authorId).toBe(otherUserId);
    });

    it("returns empty posts array when specified user has no posts", async () => {
      const mockResponse: UserPostsResponse = {
        posts: [],
        totalCount: 0,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchPostsByUserId(otherUserId);

      expect(axiosPrivate.get).toHaveBeenCalledWith(`/posts/${otherUserId}`);
      expect(result.posts).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it("throws error when user ID parameter is empty", async () => {
      await expect(postsService.fetchPostsByUserId("")).rejects.toThrow("User ID is required");
      expect(axiosPrivate.get).not.toHaveBeenCalled();
    });

    it("handles server errors correctly", async () => {
      const mockError = new Error("Server error");
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(postsService.fetchPostsByUserId(otherUserId)).rejects.toThrow("Server error");
      expect(axiosPrivate.get).toHaveBeenCalledWith(`/posts/${otherUserId}`);
    });

    it("handles 404 not found errors for non-existent user", async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: "User not found" },
        },
        message: "Request failed with status code 404",
      };
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(postsService.fetchPostsByUserId(otherUserId)).rejects.toEqual(mockError);
    });
  });

  describe("Post type validation", () => {
    it("handles text posts correctly", async () => {
      const mockTextPost: TextPost = {
        id: "post-1",
        type: "text",
        title: "Text Post",
        description: "This is a text post",
        authorName: "testuser",
        authorId: mockUserId,
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-05T12:00:00.000Z",
        likeCount: 0,
        commentCount: 0,
      };

      const mockResponse: UserPostsResponse = {
        posts: [mockTextPost],
        totalCount: 1,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(result.posts[0].type).toBe("text");
      expect((result.posts[0] as TextPost).title).toBe("Text Post");
    });

    it("handles picture posts with imageUrl correctly", async () => {
      const mockPicturePost: PicturePost = {
        id: "post-2",
        type: "picture",
        title: "Picture Post",
        description: "This is a picture post",
        authorName: "testuser",
        authorId: mockUserId,
        imageUrl: "https://example.com/image.jpg",
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-05T12:00:00.000Z",
        likeCount: 0,
        commentCount: 0,
      };

      const mockResponse: UserPostsResponse = {
        posts: [mockPicturePost],
        totalCount: 1,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(result.posts[0].type).toBe("picture");
      expect((result.posts[0] as PicturePost).imageUrl).toBe("https://example.com/image.jpg");
    });

    it("handles video posts with videoId correctly", async () => {
      const mockVideoPost: VideoPost = {
        id: "post-3",
        type: "video",
        title: "Video Post",
        description: "This is a video post",
        authorName: "testuser",
        authorId: mockUserId,
        videoId: "ec4cbe34-8750-4695-b252-69f53e51627a",
        isPrime: false,
        isAdmin: false,
        createdAt: "2026-02-05T12:00:00.000Z",
        likeCount: 0,
        commentCount: 0,
      };

      const mockResponse: UserPostsResponse = {
        posts: [mockVideoPost],
        totalCount: 1,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(result.posts[0].type).toBe("video");
      expect((result.posts[0] as VideoPost).videoId).toBe("ec4cbe34-8750-4695-b252-69f53e51627a");
    });

    it("handles mixed post types in response", async () => {
      const mockPosts: Post[] = [
        {
          id: "post-1",
          type: "text",
          title: "Text",
          description: "Text post",
          authorName: "testuser",
          authorId: mockUserId,
          isPrime: false,
          isAdmin: false,
          createdAt: "2026-02-05T12:00:00.000Z",
          likeCount: 0,
          commentCount: 0,
        },
        {
          id: "post-2",
          type: "picture",
          title: "Picture",
          description: "Picture post",
          authorName: "testuser",
          authorId: mockUserId,
          imageUrl: "https://example.com/image.jpg",
          isPrime: false,
          isAdmin: false,
          createdAt: "2026-02-04T12:00:00.000Z",
          likeCount: 0,
          commentCount: 0,
        },
        {
          id: "post-3",
          type: "video",
          title: "Video",
          description: "Video post",
          authorName: "testuser",
          authorId: mockUserId,
          videoId: "video-id-123",
          isPrime: false,
          isAdmin: false,
          createdAt: "2026-02-03T12:00:00.000Z",
          likeCount: 0,
          commentCount: 0,
        },
      ];

      const mockResponse: UserPostsResponse = {
        posts: mockPosts,
        totalCount: 3,
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await postsService.fetchUserPosts();

      expect(result.posts).toHaveLength(3);
      expect(result.posts[0].type).toBe("text");
      expect(result.posts[1].type).toBe("picture");
      expect(result.posts[2].type).toBe("video");
    });
  });
});
