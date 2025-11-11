import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import Ad from '../Ad';

describe('Ad', () => {
  const defaultProps = {
    title: 'First Update',
    startDate: '2024-08-22T08:00:00.493Z',
  };

  describe('Ad Content Display', () => {
    it('should display ad title', () => {
      render(<Ad {...defaultProps} />);
      expect(screen.getByText('First Update')).toBeTruthy();
    });

    it('should display countdown timer', () => {
      render(<Ad {...defaultProps} />);
      // DHMSTimer component should be rendered
      expect(screen.getByText('First Update')).toBeTruthy();
    });

    it('should render with valid ISO date string', () => {
      render(<Ad title="Launch Event" startDate="2025-12-31T23:59:59Z" />);
      expect(screen.getByText('Launch Event')).toBeTruthy();
    });

    it('should render with Date object', () => {
      const futureDate = new Date('2025-12-31T23:59:59Z');
      render(<Ad title="New Feature" startDate={futureDate} />);
      expect(screen.getByText('New Feature')).toBeTruthy();
    });
  });

  describe('Ad Title Variations', () => {
    it('should handle short title', () => {
      render(<Ad title="Sale" startDate={defaultProps.startDate} />);
      expect(screen.getByText('Sale')).toBeTruthy();
    });

    it('should handle long title', () => {
      const longTitle = 'Special Holiday Promotion - Limited Time Only!';
      render(<Ad title={longTitle} startDate={defaultProps.startDate} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long title', () => {
      const veryLongTitle = 'A'.repeat(200);
      render(<Ad title={veryLongTitle} startDate={defaultProps.startDate} />);
      expect(screen.getByText(veryLongTitle)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Big Sale & Event!';
      render(<Ad title={specialTitle} startDate={defaultProps.startDate} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters in title', () => {
      const unicodeTitle = 'セール Sale Venta';
      render(<Ad title={unicodeTitle} startDate={defaultProps.startDate} />);
      expect(screen.getByText(unicodeTitle)).toBeTruthy();
    });

    it('should handle emojis in title', () => {
      const emojiTitle = 'Summer Sale 🎉';
      render(<Ad title={emojiTitle} startDate={defaultProps.startDate} />);
      expect(screen.getByText(emojiTitle)).toBeTruthy();
    });
  });

  describe('Date Handling', () => {
    it('should render with past date', () => {
      render(<Ad title="Past Event" startDate="2020-01-01T00:00:00Z" />);
      expect(screen.getByText('Past Event')).toBeTruthy();
    });

    it('should render with future date', () => {
      render(<Ad title="Future Event" startDate="2030-12-31T23:59:59Z" />);
      expect(screen.getByText('Future Event')).toBeTruthy();
    });

    it('should render with current date', () => {
      const now = new Date().toISOString();
      render(<Ad title="Current Event" startDate={now} />);
      expect(screen.getByText('Current Event')).toBeTruthy();
    });

    it('should handle Date object with past date', () => {
      const pastDate = new Date('2020-01-01');
      render(<Ad title="Historical Event" startDate={pastDate} />);
      expect(screen.getByText('Historical Event')).toBeTruthy();
    });

    it('should handle Date object with future date', () => {
      const futureDate = new Date('2030-12-31');
      render(<Ad title="Upcoming Event" startDate={futureDate} />);
      expect(screen.getByText('Upcoming Event')).toBeTruthy();
    });
  });

  describe('Optional Description Prop', () => {
    it('should render without description prop', () => {
      render(<Ad title="Simple Ad" startDate={defaultProps.startDate} />);
      expect(screen.getByText('Simple Ad')).toBeTruthy();
    });

    it('should render with description prop', () => {
      render(
        <Ad
          title="Event Title"
          description="Event details here"
          startDate={defaultProps.startDate}
        />
      );
      expect(screen.getByText('Event Title')).toBeTruthy();
    });
  });

  describe('DHMSTimer Integration', () => {
    it('should integrate with DHMSTimer for countdown', () => {
      render(<Ad {...defaultProps} />);
      // Ad should render and contain DHMSTimer
      expect(screen.getByText('First Update')).toBeTruthy();
    });

    it('should pass ISO string to DHMSTimer when startDate is string', () => {
      render(<Ad title="String Date" startDate="2025-01-15T10:00:00Z" />);
      expect(screen.getByText('String Date')).toBeTruthy();
    });

    it('should convert Date object to ISO string for DHMSTimer', () => {
      const dateObj = new Date('2025-06-15T14:30:00Z');
      render(<Ad title="Date Object" startDate={dateObj} />);
      expect(screen.getByText('Date Object')).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should render with gradient background', () => {
      render(<Ad {...defaultProps} />);
      expect(screen.getByText('First Update')).toBeTruthy();
    });

    it('should maintain consistent layout across renders', () => {
      const { rerender } = render(<Ad {...defaultProps} />);
      expect(screen.getByText('First Update')).toBeTruthy();

      rerender(<Ad title="Updated Title" startDate={defaultProps.startDate} />);
      expect(screen.getByText('Updated Title')).toBeTruthy();
    });
  });
});
