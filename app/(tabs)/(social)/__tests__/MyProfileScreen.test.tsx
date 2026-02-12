/**
 * Tests for MyProfileScreen - Phase 1.5 Integration Tests
 *
 * Tests the integration of useUserPosts hook with screen behavior:
 * - Posts filtering by type
 * - ProfileTabs integration
 * - Loading and error states
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@/__tests__/test-utils';
import MyProfileScreen from '../MyProfileScreen';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useProfilePictureUpload } from '@/hooks/useProfilePictureUpload';
import { useConnections } from '@/hooks/useConnections';
import { createMockConnectionUsers } from '@/__tests__/factories/mockDataFactory';
import type { ServerUserProfile } from '@/types/UserProfile';
import type { TextPost, PicturePost, VideoPost } from '@/types/posts';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { router: mockRouter } = require('expo-router') as {
  router: { push: jest.MockedFunction<(href: string) => void> };
};

// Mock hooks
jest.mock('@/hooks/useUserProfile');
jest.mock('@/hooks/useUserPosts');
jest.mock('@/hooks/useProfilePictureUpload');
jest.mock('@/hooks/useConnections');

// Mock ProfileHeader component
jest.mock('@/components/ProfileHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return jest.fn((props) => {
    return React.createElement(
      View,
      { testID: 'mock-profile-header' },
      React.createElement(Text, {}, `Profile: ${props.user.name}`)
    );
  });
});

// Mock ProfileTabs component
jest.mock('@/components/ProfileTabs', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return jest.fn((props) => {
    return React.createElement(
      View,
      { testID: 'mock-profile-tabs' },
      React.createElement(Text, { testID: 'text-posts-count' }, `Text Posts: ${props.textPosts.length}`),
      React.createElement(Text, { testID: 'picture-posts-count' }, `Picture Posts: ${props.picturePosts.length}`),
      React.createElement(Text, { testID: 'video-posts-count' }, `Video Posts: ${props.videoPosts.length}`)
    );
  });
});

const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>;
const mockUseUserPosts = useUserPosts as jest.MockedFunction<typeof useUserPosts>;
const mockUseProfilePictureUpload = useProfilePictureUpload as jest.MockedFunction<typeof useProfilePictureUpload>;
const mockUseConnections = useConnections as jest.MockedFunction<typeof useConnections>;

const connectionDefaults: ReturnType<typeof useConnections> = {
  connections: [],
  pendingRequests: [],
  loading: false,
  error: null,
  refetch: jest.fn(),
};

describe('MyProfileScreen', () => {
  const mockProfile: ServerUserProfile = {
    _id: 'user-123',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    location: {
      country: 'USA',
      state: 'CA',
      city: 'San Francisco',
      zip: 94102,
    },
  };

  const mockTextPost: TextPost = {
    id: 'post-1',
    type: 'text',
    title: 'Test Text Post',
    description: 'This is a text post',
    authorName: 'Test User',
    authorId: 'user-123',
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
    description: 'This is a picture post',
    authorName: 'Test User',
    authorId: 'user-123',
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
    description: 'This is a video post',
    authorName: 'Test User',
    authorId: 'user-123',
    videoId: 'video-123',
    isPrime: false,
    isAdmin: false,
    createdAt: '2026-02-03T12:00:00.000Z',
    likeCount: 15,
    commentCount: 7,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseProfilePictureUpload.mockReturnValue({
      profileImageUri: null,
      handleImageSelected: jest.fn(),
      isUploading: false,
    });

    mockUseConnections.mockReturnValue(connectionDefaults);
  });

  describe('Loading States', () => {
    it('should show loading indicator when profile is loading', () => {
      mockUseUserProfile.mockReturnValue({
        profile: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    });
  });

  describe('Error States', () => {
    it('should show error message when profile fails to load', () => {
      mockUseUserProfile.mockReturnValue({
        profile: null,
        loading: false,
        error: new Error('Failed to load profile'),
        refetch: jest.fn(),
      });

      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      expect(screen.getByText('Failed to load profile')).toBeTruthy();
    });

    it('should show error message when no profile data available', () => {
      mockUseUserProfile.mockReturnValue({
        profile: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      expect(screen.getByText('No profile data available')).toBeTruthy();
    });
  });

  describe('Posts Integration - useUserPosts Hook', () => {
    beforeEach(() => {
      mockUseUserProfile.mockReturnValue({
        profile: mockProfile,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should render profile with empty posts when useUserPosts returns no posts', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-profile-header')).toBeTruthy();
        expect(screen.getByTestId('mock-profile-tabs')).toBeTruthy();
      });

      expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 0');
      expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 0');
      expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 0');
    });

    it('should filter and display text posts correctly', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [mockTextPost],
        totalCount: 1,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 1');
        expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 0');
        expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 0');
      });
    });

    it('should filter and display picture posts correctly', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [mockPicturePost],
        totalCount: 1,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 0');
        expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 1');
        expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 0');
      });
    });

    it('should filter and display video posts correctly', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [mockVideoPost],
        totalCount: 1,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 0');
        expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 0');
        expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 1');
      });
    });

    it('should filter and display mixed post types correctly', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [mockTextPost, mockPicturePost, mockVideoPost],
        totalCount: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 1');
        expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 1');
        expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 1');
      });
    });

    it('should handle multiple posts of the same type', async () => {
      const textPost2: TextPost = {
        ...mockTextPost,
        id: 'post-4',
        title: 'Another Text Post',
      };

      mockUseUserPosts.mockReturnValue({
        posts: [mockTextPost, textPost2, mockPicturePost],
        totalCount: 3,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 2');
        expect(screen.getByTestId('picture-posts-count')).toHaveTextContent('Picture Posts: 1');
        expect(screen.getByTestId('video-posts-count')).toHaveTextContent('Video Posts: 0');
      });
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      mockUseUserProfile.mockReturnValue({
        profile: mockProfile,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should render ProfileHeader with correct profile data', async () => {
      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-profile-header')).toBeTruthy();
        expect(screen.getByText('Profile: Test User')).toBeTruthy();
      });
    });

    it('should render ProfileTabs with filtered posts', async () => {
      render(<MyProfileScreen />);

      await waitFor(() => {
        expect(screen.getByTestId('mock-profile-tabs')).toBeTruthy();
      });
    });
  });

  describe('Posts Error Handling', () => {
    beforeEach(() => {
      mockUseUserProfile.mockReturnValue({
        profile: mockProfile,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should still render screen when posts fail to load', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: new Error('Failed to load posts'),
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        // Screen should still render with profile
        expect(screen.getByTestId('mock-profile-header')).toBeTruthy();
        expect(screen.getByTestId('mock-profile-tabs')).toBeTruthy();

        // Should show empty posts (graceful degradation)
        expect(screen.getByTestId('text-posts-count')).toHaveTextContent('Text Posts: 0');
      });
    });

    it('should handle posts loading state gracefully', async () => {
      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      render(<MyProfileScreen />);

      await waitFor(() => {
        // Profile should load, posts can be loading separately
        expect(screen.getByTestId('mock-profile-header')).toBeTruthy();
        expect(screen.getByTestId('mock-profile-tabs')).toBeTruthy();
      });
    });
  });

  describe('Connections Integration', () => {
    beforeEach(() => {
      mockUseUserProfile.mockReturnValue({
        profile: mockProfile,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      mockUseUserPosts.mockReturnValue({
        posts: [],
        totalCount: 0,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it('should display the connection count', () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(5),
      });

      render(<MyProfileScreen />);

      expect(screen.getByText('5 Connections')).toBeTruthy();
    });

    it('should display zero connections gracefully', () => {
      render(<MyProfileScreen />);

      expect(screen.getByText('0 Connections')).toBeTruthy();
    });

    it('should navigate to connections screen when tapped', () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(3),
      });

      render(<MyProfileScreen />);

      fireEvent.press(screen.getByLabelText('View connections'));

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/(tabs)/(social)/ConnectedUsersScreen'
      );
    });

    it('should display a metrics dashboard with connection and pending data', () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(8),
        pendingRequests: [
          {
            _id: 'req-1',
            requester: 'other',
            recipient: 'me',
            status: 'pending',
            createdAt: '2026-02-01T00:00:00Z',
            updatedAt: '2026-02-01T00:00:00Z',
          },
        ],
      });

      render(<MyProfileScreen />);

      expect(screen.getByLabelText('Profile metrics')).toBeTruthy();
      expect(screen.getByText('8')).toBeTruthy();
      expect(screen.getByText('1')).toBeTruthy();
    });
  });
});
