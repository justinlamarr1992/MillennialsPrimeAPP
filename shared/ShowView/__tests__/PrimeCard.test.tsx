import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import PrimeCard from '../PrimeCard';

describe('PrimeCard', () => {
  const defaultProps = {
    userPosting: 'user-123',
    id: 'user-456',
    prime: false,
    thumbnail: 'https://example.com/thumbnail.jpg',
    videoLibraryId: '147838',
    guid: 'test-guid-123',
    title: 'Amazing Video',
    description: 'This is an amazing video',
    dateUploaded: '2025-01-15',
    name: 'Test User',
    time: '10:30',
    key: 'card-1',
  };

  describe('Card Content Display', () => {
    it('should display video title', () => {
      render(<PrimeCard {...defaultProps} />);
      expect(screen.getByText('Amazing Video')).toBeTruthy();
    });

    it('should display video description', () => {
      render(<PrimeCard {...defaultProps} />);
      expect(screen.getByText('This is an amazing video')).toBeTruthy();
    });

    it('should display "No Description for now" when description is empty', () => {
      render(<PrimeCard {...defaultProps} description="" />);
      expect(screen.getByText('No Description for now')).toBeTruthy();
    });

    it('should display upload date', () => {
      render(<PrimeCard {...defaultProps} />);
      expect(screen.getByText(/Date Uploaded:.*2025-01-15/)).toBeTruthy();
    });

    it('should display "Loading" when date is empty', () => {
      render(<PrimeCard {...defaultProps} dateUploaded="" />);
      expect(screen.getByText(/Date Uploaded:.*Loading/)).toBeTruthy();
    });

    it('should display prime status as True', () => {
      render(<PrimeCard {...defaultProps} prime={true} />);
      expect(screen.getByText(/Prime:.*True/)).toBeTruthy();
    });

    it('should display prime status as False', () => {
      render(<PrimeCard {...defaultProps} prime={false} />);
      expect(screen.getByText(/Prime:.*False/)).toBeTruthy();
    });
  });

  describe('Prime vs Regular Styling', () => {
    it('should render with prime styling when prime is true', () => {
      render(<PrimeCard {...defaultProps} prime={true} />);
      expect(screen.getByText('Amazing Video')).toBeTruthy();
      expect(screen.getByText(/Prime:.*True/)).toBeTruthy();
    });

    it('should render with regular styling when prime is false', () => {
      render(<PrimeCard {...defaultProps} prime={false} />);
      expect(screen.getByText('Amazing Video')).toBeTruthy();
      expect(screen.getByText(/Prime:.*False/)).toBeTruthy();
    });
  });

  describe('User Interaction', () => {
    it('should handle video press', () => {
      render(<PrimeCard {...defaultProps} />);
      const touchable = screen.getByText('Amazing Video').parent;
      if (touchable) {
        fireEvent.press(touchable);
      }
      expect(screen.getByText('Amazing Video')).toBeTruthy();
    });
  });

  describe('Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<PrimeCard {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(500);
      render(<PrimeCard {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Video & Title with "Quotes"';
      render(<PrimeCard {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      render(
        <PrimeCard
          {...defaultProps}
          title="ビデオ Video"
          description="説明 Description"
        />
      );
      expect(screen.getByText('ビデオ Video')).toBeTruthy();
      expect(screen.getByText('説明 Description')).toBeTruthy();
    });

    it('should handle emojis in content', () => {
      render(
        <PrimeCard
          {...defaultProps}
          title="Great Video 🎬"
          description="Must watch! 🔥"
        />
      );
      expect(screen.getByText('Great Video 🎬')).toBeTruthy();
      expect(screen.getByText('Must watch! 🔥')).toBeTruthy();
    });
  });

  describe('Date Formatting', () => {
    it('should display ISO date format', () => {
      render(<PrimeCard {...defaultProps} dateUploaded="2025-01-15T10:30:00Z" />);
      expect(screen.getByText(/Date Uploaded:.*2025-01-15T10:30:00Z/)).toBeTruthy();
    });

    it('should display simple date format', () => {
      render(<PrimeCard {...defaultProps} dateUploaded="January 15, 2025" />);
      expect(screen.getByText(/Date Uploaded:.*January 15, 2025/)).toBeTruthy();
    });

    it('should display custom date formats', () => {
      const dates = ['2025-01-15', '01/15/2025', '15-01-2025'];
      dates.forEach((date) => {
        const { unmount } = render(<PrimeCard {...defaultProps} dateUploaded={date} />);
        expect(screen.getByText(new RegExp(`Date Uploaded:.*${date.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Component Structure', () => {
    it('should render with all required props', () => {
      render(<PrimeCard {...defaultProps} />);
      expect(screen.getByText('Amazing Video')).toBeTruthy();
      expect(screen.getByText('This is an amazing video')).toBeTruthy();
      expect(screen.getByText(/Date Uploaded:/)).toBeTruthy();
      expect(screen.getByText(/Prime:/)).toBeTruthy();
    });

    it('should maintain consistent rendering', () => {
      const { rerender } = render(<PrimeCard {...defaultProps} />);
      expect(screen.getByText('Amazing Video')).toBeTruthy();

      rerender(<PrimeCard {...defaultProps} title="New Title" />);
      expect(screen.getByText('New Title')).toBeTruthy();
    });
  });
});
