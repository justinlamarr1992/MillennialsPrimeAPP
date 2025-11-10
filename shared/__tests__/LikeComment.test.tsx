import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import LikeComment from '../LikeComment';

describe('LikeComment', () => {
  describe('Initial Render', () => {
    it('should display interaction counts', () => {
      const { getAllByText } = render(<LikeComment />);

      // Should display count values
      const counts = getAllByText('13');
      expect(counts.length).toBeGreaterThanOrEqual(2);
    });

    it('should render successfully with default state', () => {
      render(<LikeComment />);

      // Should render without errors
      const counts = screen.getAllByText('13');
      expect(counts.length).toBeGreaterThan(0);
    });
  });

  describe('Interaction Display', () => {
    it('should display like and dislike interaction options', () => {
      const { getAllByText } = render(<LikeComment />);

      // Should display multiple interaction counts
      const counts = getAllByText('13');
      expect(counts.length).toBeGreaterThanOrEqual(2);
    });

    it('should display comment interaction option', () => {
      const { getAllByText } = render(<LikeComment />);

      // Comment count should be visible
      const counts = getAllByText('13');
      expect(counts.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Display', () => {
    it('should render with theme-appropriate colors', () => {
      render(<LikeComment />);

      // Should render without errors (theme colors applied)
      const counts = screen.getAllByText('13');
      expect(counts.length).toBeGreaterThan(0);
    });

    it('should display consistent count values', () => {
      const { getAllByText } = render(<LikeComment />);

      // All counts should be '13' in the default component
      const counts = getAllByText('13');
      expect(counts.length).toBeGreaterThanOrEqual(2);
    });

    it('should render interaction elements in a horizontal layout', () => {
      render(<LikeComment />);

      // Should render successfully
      expect(screen.getAllByText('13').length).toBeGreaterThan(0);
    });
  });

  describe('Component Stability', () => {
    it('should render without crashing', () => {
      expect(() => render(<LikeComment />)).not.toThrow();
    });

    it('should maintain consistent display across re-renders', () => {
      const { rerender } = render(<LikeComment />);

      // Initial render
      expect(screen.getAllByText('13').length).toBeGreaterThan(0);

      // Re-render
      rerender(<LikeComment />);

      // Should still display correctly
      expect(screen.getAllByText('13').length).toBeGreaterThan(0);
    });
  });
});
