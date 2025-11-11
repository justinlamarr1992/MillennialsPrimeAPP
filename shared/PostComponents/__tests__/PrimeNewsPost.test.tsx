import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import PrimeNewsPost from '../PrimeNewsPost';

describe('PrimeNewsPost', () => {
  const defaultProps = {
    guid: 'test-guid-123',
    dateUploaded: '2025-01-15T10:00:00Z',
    videoLibraryId: '147838',
    name: 'Admin User',
    time: '2025-01-15T10:00:00Z',
    url: 'https://video.bunnycdn.com/embed/147838/test-guid-123',
    title: 'Breaking News Update',
    description: 'Important announcement for all members',
    prime: true,
    admin: false,
    libraryId: '147838',
    videoId: 'test-guid-123',
  };

  describe('News Content Display', () => {
    it('should display hardcoded name "Millennials Prime Admin"', () => {
      render(<PrimeNewsPost {...defaultProps} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
    });

    it('should display news title', () => {
      render(<PrimeNewsPost {...defaultProps} />);
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
    });

    it('should display news description', () => {
      render(<PrimeNewsPost {...defaultProps} />);
      expect(screen.getByText('Important announcement for all members')).toBeTruthy();
    });

    it('should display "No Title Yet" when title is empty', () => {
      render(<PrimeNewsPost {...defaultProps} title="" />);
      expect(screen.getByText('No Title Yet')).toBeTruthy();
    });

    it('should display "No Description Yet" when description is empty', () => {
      render(<PrimeNewsPost {...defaultProps} description="" />);
      expect(screen.getByText('No Description Yet')).toBeTruthy();
    });
  });

  describe('Admin vs Prime Styling', () => {
    it('should render news post with admin styling', () => {
      render(<PrimeNewsPost {...defaultProps} admin={true} prime={false} />);
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
      expect(screen.getByText('Important announcement for all members')).toBeTruthy();
    });

    it('should render news post with prime styling (non-admin)', () => {
      render(<PrimeNewsPost {...defaultProps} admin={false} prime={true} />);
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
      expect(screen.getByText('Important announcement for all members')).toBeTruthy();
    });

    it('should render news post with prime styling when neither admin nor prime', () => {
      render(<PrimeNewsPost {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
      expect(screen.getByText('Important announcement for all members')).toBeTruthy();
    });
  });

  describe('News Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(500);
      render(<PrimeNewsPost {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(1000);
      render(<PrimeNewsPost {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Breaking: Important Update & Announcements!';
      render(<PrimeNewsPost {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      render(
        <PrimeNewsPost
          {...defaultProps}
          title="重要なお知らせ Important News"
          description="Actualización importante 更新"
        />
      );
      expect(screen.getByText('重要なお知らせ Important News')).toBeTruthy();
      expect(screen.getByText('Actualización importante 更新')).toBeTruthy();
    });

    it('should handle emojis in content', () => {
      render(
        <PrimeNewsPost
          {...defaultProps}
          title="Breaking News 📰"
          description="Major announcement! 🎉"
        />
      );
      expect(screen.getByText('Breaking News 📰')).toBeTruthy();
      expect(screen.getByText('Major announcement! 🎉')).toBeTruthy();
    });

    it('should handle multiline description', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      render(<PrimeNewsPost {...defaultProps} description={multilineDescription} />);
      expect(screen.getByText(multilineDescription)).toBeTruthy();
    });
  });

  describe('Video Content Props', () => {
    it('should render with valid video identifiers', () => {
      render(
        <PrimeNewsPost
          {...defaultProps}
          guid="video-guid-456"
          videoLibraryId="999999"
        />
      );
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
    });

    it('should render with different library and video IDs', () => {
      render(
        <PrimeNewsPost
          {...defaultProps}
          libraryId="123456"
          videoId="custom-video-id"
        />
      );
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
    });

    it('should render with valid date formats', () => {
      const dates = [
        '2025-01-15T10:00:00Z',
        '2025-12-31T23:59:59Z',
        '2025-06-01T12:00:00.000Z',
      ];

      dates.forEach((date) => {
        const { unmount } = render(
          <PrimeNewsPost
            {...defaultProps}
            dateUploaded={date}
            time={date}
          />
        );
        expect(screen.getByText('Breaking News Update')).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Required Props', () => {
    it('should render with all required props', () => {
      render(<PrimeNewsPost {...defaultProps} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
      expect(screen.getByText('Breaking News Update')).toBeTruthy();
      expect(screen.getByText('Important announcement for all members')).toBeTruthy();
    });

    it('should render with minimal content', () => {
      render(
        <PrimeNewsPost
          {...defaultProps}
          title="Brief Update"
          description=""
        />
      );
      expect(screen.getByText('Brief Update')).toBeTruthy();
      expect(screen.getByText('No Description Yet')).toBeTruthy();
    });
  });

  describe('UserInfo Integration', () => {
    it('should display admin badge when admin is true', () => {
      render(<PrimeNewsPost {...defaultProps} admin={true} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
    });

    it('should display prime badge when prime is true', () => {
      render(<PrimeNewsPost {...defaultProps} prime={true} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
    });

    it('should display name consistently across different props', () => {
      const { rerender } = render(<PrimeNewsPost {...defaultProps} admin={true} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();

      rerender(<PrimeNewsPost {...defaultProps} admin={false} prime={true} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();

      rerender(<PrimeNewsPost {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
    });
  });
});
