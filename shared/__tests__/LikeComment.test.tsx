import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import LikeComment from '../LikeComment';

describe('LikeComment', () => {
  it('should display interaction counts on initial render', () => {
    render(<LikeComment />);
    // Should display count values for like, dislike, and comment (3 total)
    const counts = screen.getAllByText('13');
    expect(counts).toHaveLength(3);
  });

  it('should render without crashing', () => {
    expect(() => render(<LikeComment />)).not.toThrow();
  });

  it('should maintain consistent display across re-renders', () => {
    const { rerender } = render(<LikeComment />);
    // Initial render - should have 3 counts (like, dislike, comment)
    expect(screen.getAllByText('13')).toHaveLength(3);
    // Re-render
    rerender(<LikeComment />);
    // Should still display correctly
    expect(screen.getAllByText('13')).toHaveLength(3);
  });
});
