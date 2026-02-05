/**
 * Tests for useUserPosts hook
 * Target Coverage: 90%
 *
 * Behavior-focused tests: We test what the hook does, not how it does it
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserPosts } from '../useUserPosts';
import { postsService } from '@/services/postsService';
import type { UserPostsResponse } from '@/services/postsService';
import useAuth from '../useAuth';
import useAxiosPrivate from '../useAxiosPrivate';
import type { TextPost, PicturePost, VideoPost } from '@/types/posts';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('../useAxiosPrivate');
jest.mock('@/services/postsService');
jest.mock('@/utils/logger');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<typeof useAxiosPrivate>;
const mockPostsService = postsService as jest.Mocked<typeof postsService>;

describe('useUserPosts', () => {
  const mockAxiosPrivate = {} as ReturnType<typeof useAxiosPrivate>;
  const mockUserId = 'user-123';

  const mockTextPost: TextPost = {
    id: 'post-1',
    type: 'text',
    title: 'Test Text Post',
    description: 'This is a test text post',
    authorName: 'Test User',
    authorId: mockUserId,
    isPrime: false,
    isAdmin: false,
    createdAt: '2026-02-05T12:00:00.000Z',
    likeCount: 5,
    commentCount: 2,
  };

  const mockPicturePost: PicturePost = {
    id: 'post-2',
    type: 'picture',
    title: 'Test Picture Post',
    description: 'This is a test picture post',
    authorName: 'Test User',
    authorId: mockUserId,
    imageUrl: 'https://example.com/image.jpg',
    isPrime: false,
    isAdmin: false,
    createdAt: '2026-02-04T12:00:00.000Z',
    likeCount: 10,
    commentCount: 3,
  };

  const mockVideoPost: VideoPost = {
    id: 'post-3',
    type: 'video',
    title: 'Test Video Post',
    description: 'This is a test video post',
    authorName: 'Test User',
    authorId: mockUserId,
    videoId: 'ec4cbe34-8750-4695-b252-69f53e51627a',
    isPrime: false,
    isAdmin: false,
    createdAt: '2026-02-03T12:00:00.000Z',
    likeCount: 15,
    commentCount: 7,
  };

  const mockPostsResponse: UserPostsResponse = {
    posts: [mockTextPost, mockPicturePost, mockVideoPost],
    totalCount: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxiosPrivate.mockReturnValue(mockAxiosPrivate);
  });

  describe('When no user is logged in', () => {
    it('should return empty posts array and not be loading', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.error).toBeNull();
    });

    it('should not call postsService when user is null', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(mockPostsService.fetchUserPosts).not.toHaveBeenCalled();
      });
    });
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: mockUserId, email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });
    });

    it('should return posts data after loading', async () => {
      mockPostsService.fetchUserPosts.mockResolvedValue(mockPostsResponse);

      const { result } = renderHook(() => useUserPosts());

      // Eventually the posts should be loaded
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPostsResponse.posts);
      expect(result.current.totalCount).toBe(3);
      expect(result.current.error).toBeNull();
    });

    it('should return empty array when user has no posts', async () => {
      const emptyResponse: UserPostsResponse = {
        posts: [],
        totalCount: 0,
      };
      mockPostsService.fetchUserPosts.mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.error).toBeNull();
    });

    it('should return error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      mockPostsService.fetchUserPosts.mockRejectedValue(fetchError);

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.error).toEqual(fetchError);
    });

    it('should allow refetching posts', async () => {
      const updatedPost: TextPost = {
        ...mockTextPost,
        title: 'Updated Post Title',
        likeCount: 20,
      };
      const updatedResponse: UserPostsResponse = {
        posts: [updatedPost],
        totalCount: 1,
      };

      mockPostsService.fetchUserPosts
        .mockResolvedValueOnce(mockPostsResponse)
        .mockResolvedValueOnce(updatedResponse);

      const { result } = renderHook(() => useUserPosts());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.posts).toHaveLength(3);
      });

      // Refetch
      await result.current.refetch();

      // Should have updated data
      await waitFor(() => {
        expect(result.current.posts).toHaveLength(1);
        expect(result.current.posts[0].title).toBe('Updated Post Title');
        expect((result.current.posts[0] as TextPost).likeCount).toBe(20);
      });
    });

    it('should clear error on successful refetch', async () => {
      // First fetch fails
      mockPostsService.fetchUserPosts.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useUserPosts());

      // Wait for error
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Refetch succeeds
      mockPostsService.fetchUserPosts.mockResolvedValueOnce(mockPostsResponse);
      await result.current.refetch();

      // Error should be cleared and posts loaded
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.posts).toEqual(mockPostsResponse.posts);
      });
    });

    it('should handle server 404 errors', async () => {
      const notFoundError = new Error('Posts not found');
      mockPostsService.fetchUserPosts.mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toEqual(notFoundError);
    });

    it('should handle server 500 errors', async () => {
      const serverError = new Error('Internal server error');
      mockPostsService.fetchUserPosts.mockRejectedValue(serverError);

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toEqual(serverError);
    });
  });

  describe('When auth state changes', () => {
    it('should load posts when user logs in', async () => {
      mockPostsService.fetchUserPosts.mockResolvedValue(mockPostsResponse);

      const { result, rerender } = renderHook(
        ({ user }) => {
          mockUseAuth.mockReturnValue({
            user,
            loading: false,
            signIn: jest.fn(),
            signOut: jest.fn(),
            signUp: jest.fn(),
          });
          return useUserPosts();
        },
        {
          initialProps: { user: null as any },
        }
      );

      // Initially no posts
      await waitFor(() => {
        expect(result.current.posts).toEqual([]);
      });

      // User logs in
      rerender({ user: { uid: mockUserId, email: 'test@example.com' } });

      // Posts should load
      await waitFor(() => {
        expect(result.current.posts).toEqual(mockPostsResponse.posts);
        expect(result.current.totalCount).toBe(3);
      });
    });

    it('should clear posts when user logs out', async () => {
      mockPostsService.fetchUserPosts.mockResolvedValue(mockPostsResponse);

      const { result, rerender } = renderHook(
        ({ user }) => {
          mockUseAuth.mockReturnValue({
            user,
            loading: false,
            signIn: jest.fn(),
            signOut: jest.fn(),
            signUp: jest.fn(),
          });
          return useUserPosts();
        },
        {
          initialProps: { user: { uid: mockUserId, email: 'test@example.com' } as any },
        }
      );

      // Wait for posts to load
      await waitFor(() => {
        expect(result.current.posts).toEqual(mockPostsResponse.posts);
      });

      // User logs out
      rerender({ user: null });

      // Posts should be cleared
      await waitFor(() => {
        expect(result.current.posts).toEqual([]);
        expect(result.current.totalCount).toBe(0);
      });
    });
  });

  describe('Post type handling', () => {
    it('should correctly handle text posts', async () => {
      const textPostResponse: UserPostsResponse = {
        posts: [mockTextPost],
        totalCount: 1,
      };
      mockPostsService.fetchUserPosts.mockResolvedValue(textPostResponse);

      mockUseAuth.mockReturnValue({
        user: { uid: mockUserId, email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.posts).toHaveLength(1);
        expect(result.current.posts[0].type).toBe('text');
      });
    });

    it('should correctly handle picture posts with imageUrl', async () => {
      const picturePostResponse: UserPostsResponse = {
        posts: [mockPicturePost],
        totalCount: 1,
      };
      mockPostsService.fetchUserPosts.mockResolvedValue(picturePostResponse);

      mockUseAuth.mockReturnValue({
        user: { uid: mockUserId, email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.posts).toHaveLength(1);
        expect(result.current.posts[0].type).toBe('picture');
        expect((result.current.posts[0] as PicturePost).imageUrl).toBe(
          'https://example.com/image.jpg'
        );
      });
    });

    it('should correctly handle video posts with videoId', async () => {
      const videoPostResponse: UserPostsResponse = {
        posts: [mockVideoPost],
        totalCount: 1,
      };
      mockPostsService.fetchUserPosts.mockResolvedValue(videoPostResponse);

      mockUseAuth.mockReturnValue({
        user: { uid: mockUserId, email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.posts).toHaveLength(1);
        expect(result.current.posts[0].type).toBe('video');
        expect((result.current.posts[0] as VideoPost).videoId).toBe(
          'ec4cbe34-8750-4695-b252-69f53e51627a'
        );
      });
    });

    it('should correctly handle mixed post types', async () => {
      mockPostsService.fetchUserPosts.mockResolvedValue(mockPostsResponse);

      mockUseAuth.mockReturnValue({
        user: { uid: mockUserId, email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserPosts());

      await waitFor(() => {
        expect(result.current.posts).toHaveLength(3);
        expect(result.current.posts[0].type).toBe('text');
        expect(result.current.posts[1].type).toBe('picture');
        expect(result.current.posts[2].type).toBe('video');
      });
    });
  });
});
