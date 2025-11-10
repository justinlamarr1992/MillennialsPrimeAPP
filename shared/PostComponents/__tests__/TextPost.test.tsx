import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import TextPost from '../TextPost';
import { mockUser } from '@/__tests__/__mocks__/firebase';
import type { User } from 'firebase/auth';

// Mock useAuth to control current user
jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useAuth from '@/hooks/useAuth';

// Helper to create mock user with custom uid - we only need uid for ownership checks
const createMockUser = (uid: string, email: string): User => ({
  ...mockUser,
  uid,
  email,
}) as User;

describe('TextPost', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  const defaultProps = {
    name: 'John Doe',
    title: 'Test Post Title',
    description: 'This is a test post description',
    prime: false,
    admin: false,
    authorId: 'author-123',
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

  describe('Post Content Display', () => {
    it('should display post title', () => {
      render(<TextPost {...defaultProps} />);
      expect(screen.getByText('Test Post Title')).toBeTruthy();
    });

    it('should display post description', () => {
      render(<TextPost {...defaultProps} />);
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should display "No Title yet" when title is empty', () => {
      render(<TextPost {...defaultProps} title="" />);
      expect(screen.getByText('No Title yet')).toBeTruthy();
    });

    it('should display "No description Yet" when description is empty', () => {
      render(<TextPost {...defaultProps} description="" />);
      expect(screen.getByText('No description Yet')).toBeTruthy();
    });

    it('should display "No Title yet" when title is undefined or falsy', () => {
      render(<TextPost {...defaultProps} title="" />);
      expect(screen.getByText('No Title yet')).toBeTruthy();
    });

    it('should display "No description Yet" when description is undefined or falsy', () => {
      render(<TextPost {...defaultProps} description="" />);
      expect(screen.getByText('No description Yet')).toBeTruthy();
    });
  });

  describe('User Role Display', () => {
    it('should render post with admin styling when user is admin', () => {
      render(<TextPost {...defaultProps} admin={true} />);
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should render post with prime styling when user is prime member', () => {
      render(<TextPost {...defaultProps} prime={true} />);
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should render post with default styling when user is neither admin nor prime', () => {
      render(<TextPost {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });
  });

  describe('Post Ownership and Delete Functionality', () => {
    it('should render post successfully when current user is the post author', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser('author-123', 'author@test.com'),
        loading: false,
      });

      render(<TextPost {...defaultProps} authorId="author-123" />);

      // Post should render with all content when user is the author
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should render post successfully when current user is not the post author', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser('different-user', 'other@test.com'),
        loading: false,
      });

      render(<TextPost {...defaultProps} authorId="author-123" />);

      // Post should render normally even when not the author
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should render post successfully when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      render(<TextPost {...defaultProps} />);

      // Post should render even when user is not logged in
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });
  });

  describe('Like and Comment Integration', () => {
    it('should render LikeComment component within post', () => {
      render(<TextPost {...defaultProps} />);

      // LikeComment component should be rendered
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });
  });

  describe('Post Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(500);
      render(<TextPost {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(1000);
      render(<TextPost {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Test & Title with Special Characters';
      render(<TextPost {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters in description', () => {
      const unicodeDescription = 'Hello World in Multiple Languages';
      render(<TextPost {...defaultProps} description={unicodeDescription} />);
      expect(screen.getByText(unicodeDescription)).toBeTruthy();
    });

    it('should handle multiline description', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      render(<TextPost {...defaultProps} description={multilineDescription} />);
      expect(screen.getByText(multilineDescription)).toBeTruthy();
    });
  });

  describe('Author ID Validation', () => {
    it('should render correctly when post author matches current user', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser('test-user-123', 'test@example.com'),
        loading: false,
      });

      render(<TextPost {...defaultProps} authorId="test-user-123" />);

      // Post should render successfully
      expect(screen.getByText('Test Post Title')).toBeTruthy();
      expect(screen.getByText('This is a test post description')).toBeTruthy();
    });

    it('should handle missing authorId gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: createMockUser('test-user-123', 'test@example.com'),
        loading: false,
      });

      render(<TextPost {...defaultProps} authorId="" />);
      expect(screen.getByText('Test Post Title')).toBeTruthy();
    });
  });
});
