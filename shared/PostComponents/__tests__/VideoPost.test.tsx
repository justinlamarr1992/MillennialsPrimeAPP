import React from 'react';
import { render, screen, createMockUser } from '@/__tests__/test-utils';
import VideoPost from '../VideoPost';
import useAuth from '@/hooks/useAuth';

// Mock useAuth to control current user
jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('VideoPost', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  const defaultProps = {
    name: 'Video Author',
    title: 'Test Video Title',
    description: 'This is a test video description',
    prime: false,
    admin: false,
    authorId: 'author-123',
    libraryId: '147838',
    videoId: 'test-video-id',
  };

  beforeEach(() => {
    // Default: user is not logged in
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Video Content Display', () => {
    it('should display author name from props', () => {
      render(<VideoPost {...defaultProps} />);
      expect(screen.getByText('Video Author')).toBeTruthy();
    });

    it('should display video title', () => {
      render(<VideoPost {...defaultProps} />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
    });

    it('should display video description', () => {
      render(<VideoPost {...defaultProps} />);
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });

    it('should display "No Title Yet" when title is empty', () => {
      render(<VideoPost {...defaultProps} title="" />);
      expect(screen.getByText('No Title Yet')).toBeTruthy();
    });

    it('should display "No Description Yet" when description is empty', () => {
      render(<VideoPost {...defaultProps} description="" />);
      expect(screen.getByText('No Description Yet')).toBeTruthy();
    });
  });

  describe('User Role Display', () => {
    it('should render video post for admin user', () => {
      render(<VideoPost {...defaultProps} admin={true} />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });

    it('should render video post for prime member', () => {
      render(<VideoPost {...defaultProps} prime={true} />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });

    it('should render video post for regular user', () => {
      render(<VideoPost {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });
  });

  describe('Post Ownership', () => {
    it('should render post when current user is the author', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser({ uid: 'author-123', email: 'author@test.com' }),
        loading: false,
      });

      render(<VideoPost {...defaultProps} authorId="author-123" />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });

    it('should render post when current user is not the author', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser({ uid: 'different-user', email: 'other@test.com' }),
        loading: false,
      });

      render(<VideoPost {...defaultProps} authorId="author-123" />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });

    it('should render post when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      render(<VideoPost {...defaultProps} />);
      expect(screen.getByText('Test Video Title')).toBeTruthy();
      expect(screen.getByText('This is a test video description')).toBeTruthy();
    });
  });

  describe('Video Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(500);
      render(<VideoPost {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(1000);
      render(<VideoPost {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Amazing Video & Special Characters';
      render(<VideoPost {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      render(
        <VideoPost
          {...defaultProps}
          title="日本語 Español"
          description="Testing unicode content"
        />
      );
      expect(screen.getByText('日本語 Español')).toBeTruthy();
      expect(screen.getByText('Testing unicode content')).toBeTruthy();
    });

    it('should handle emojis in content', () => {
      render(
        <VideoPost
          {...defaultProps}
          title="Amazing Video 🎬"
          description="Check this out! 🔥"
        />
      );
      expect(screen.getByText('Amazing Video 🎬')).toBeTruthy();
      expect(screen.getByText('Check this out! 🔥')).toBeTruthy();
    });

    it('should handle multiline description', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      render(<VideoPost {...defaultProps} description={multilineDescription} />);
      expect(screen.getByText(multilineDescription)).toBeTruthy();
    });
  });

  describe('Optional Props', () => {
    it('should render with minimal required props', () => {
      render(
        <VideoPost
          name="Test Author"
          title="Minimal Video"
          description="Basic description"
          prime={false}
          admin={false}
          authorId="test-author"
        />
      );
      expect(screen.getByText('Minimal Video')).toBeTruthy();
      expect(screen.getByText('Basic description')).toBeTruthy();
    });

    it('should handle missing library ID and video ID', () => {
      render(
        <VideoPost
          name="Test Author"
          title="Test Video"
          description="Test description"
          prime={false}
          admin={false}
          authorId="test-author"
        />
      );
      expect(screen.getByText('Test Video')).toBeTruthy();
    });
  });
});
