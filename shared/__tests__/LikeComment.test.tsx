import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import LikeComment from '../LikeComment';

describe('LikeComment', () => {
  it('should display interaction counts on initial render', () => {
    const { getAllByText } = render(<LikeComment />);
    // Should display count values for like, dislike, and comment
    const counts = getAllByText('13');
    expect(counts.length).toBeGreaterThanOrEqual(2);
  });

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
