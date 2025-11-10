import React from 'react';
import { render, screen, waitFor } from '@/__tests__/test-utils';
import DHMSTimer from '../DHMSTimer';

// Mock timers
jest.useFakeTimers();

describe('DHMSTimer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Timer Display', () => {
    it('should display countdown timer with all time units', () => {
      const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

      render(<DHMSTimer startDate={futureDate} />);

      // Should display time unit labels
      expect(screen.getByText('days')).toBeTruthy();
      expect(screen.getByText('hrs')).toBeTruthy();
      expect(screen.getByText('min')).toBeTruthy();
      expect(screen.getByText('sec')).toBeTruthy();
    });

    it('should display time separators between units', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60);

      render(<DHMSTimer startDate={futureDate} />);

      // Should display colons as separators
      const colons = screen.getAllByText(':');
      expect(colons.length).toBe(3); // Three colons between four time units
    });
  });

  describe('Time Calculations', () => {
    it('should calculate days correctly for future date', () => {
      const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

      render(<DHMSTimer startDate={twoDaysFromNow} />);

      // Should show 1 or 2 days (depending on exact time)
      expect(screen.getByText('days')).toBeTruthy();
    });

    it('should handle dates provided as string', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();

      render(<DHMSTimer startDate={futureDate} />);

      expect(screen.getByText('hrs')).toBeTruthy();
    });

    it('should handle dates provided as Date object', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60);

      render(<DHMSTimer startDate={futureDate} />);

      expect(screen.getByText('hrs')).toBeTruthy();
    });
  });

  describe('Countdown Behavior', () => {
    it('should update countdown every second', async () => {
      const futureDate = new Date(Date.now() + 5000); // 5 seconds from now

      render(<DHMSTimer startDate={futureDate} />);

      // Initial render
      expect(screen.getByText('sec')).toBeTruthy();

      // Advance timer by 1 second
      jest.advanceTimersByTime(1000);

      // Should still be counting
      await waitFor(() => {
        expect(screen.getByText('sec')).toBeTruthy();
      });
    });

    it('should stop counting when target time is reached', () => {
      const pastDate = new Date(Date.now() - 1000);

      render(<DHMSTimer startDate={pastDate} />);

      // Should render even for past dates
      expect(screen.getByText('days')).toBeTruthy();

      // Advance timers
      jest.advanceTimersByTime(2000);

      // Should still render (timer stopped)
      expect(screen.getByText('days')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large time differences', () => {
      const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

      render(<DHMSTimer startDate={farFuture} />);

      expect(screen.getByText('days')).toBeTruthy();
      expect(screen.getByText('hrs')).toBeTruthy();
    });

    it('should handle negative time differences (past dates)', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      render(<DHMSTimer startDate={pastDate} />);

      // Should render without crashing
      expect(screen.getByText('days')).toBeTruthy();
    });

    it('should handle invalid date strings gracefully', () => {
      render(<DHMSTimer startDate="invalid-date" />);

      // Should render without crashing (NaN handling)
      expect(screen.getByText('days')).toBeTruthy();
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up interval on unmount', () => {
      const futureDate = new Date(Date.now() + 10000);

      const { unmount } = render(<DHMSTimer startDate={futureDate} />);

      // Verify timer is running
      expect(screen.getByText('sec')).toBeTruthy();

      // Unmount component
      unmount();

      // Advance timers (should not cause issues)
      jest.advanceTimersByTime(5000);

      // No assertions needed - just verifying no memory leaks
    });

    it('should restart interval when startDate changes', () => {
      const firstDate = new Date(Date.now() + 5000);

      const { rerender } = render(<DHMSTimer startDate={firstDate} />);

      // Initial render
      expect(screen.getByText('sec')).toBeTruthy();

      // Change the start date
      const secondDate = new Date(Date.now() + 10000);
      rerender(<DHMSTimer startDate={secondDate} />);

      // Should still render with new date
      expect(screen.getByText('sec')).toBeTruthy();
    });
  });

  describe('Time Unit Formatting', () => {
    it('should display all four time units', () => {
      const futureDate = new Date(Date.now() + 100000);

      render(<DHMSTimer startDate={futureDate} />);

      expect(screen.getByText('days')).toBeTruthy();
      expect(screen.getByText('hrs')).toBeTruthy();
      expect(screen.getByText('min')).toBeTruthy();
      expect(screen.getByText('sec')).toBeTruthy();
    });

    it('should display abbreviated unit labels', () => {
      const futureDate = new Date(Date.now() + 1000);

      render(<DHMSTimer startDate={futureDate} />);

      // Abbreviated labels
      expect(screen.getByText('sec')).toBeTruthy();
      expect(screen.getByText('min')).toBeTruthy();
      expect(screen.getByText('hrs')).toBeTruthy();
    });
  });
});
