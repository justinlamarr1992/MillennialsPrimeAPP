import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import PreviewCard from '../PreviewCard';

describe('PreviewCard', () => {
  const defaultProps = {
    thumbnail: 'https://example.com/thumbnail.jpg',
    title: 'Preview Video',
    description: 'This is a preview description',
    name: 'Test User',
    time: '10:30',
  };

  describe('Card Content Display', () => {
    it('should display preview title', () => {
      render(<PreviewCard {...defaultProps} />);
      expect(screen.getByText('Preview Video')).toBeTruthy();
    });

    it('should display preview description', () => {
      render(<PreviewCard {...defaultProps} />);
      expect(screen.getByText('This is a preview description')).toBeTruthy();
    });
  });

  describe('Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<PreviewCard {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(500);
      render(<PreviewCard {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Preview & Title with "Quotes"';
      render(<PreviewCard {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      render(
        <PreviewCard
          {...defaultProps}
          title="プレビュー Preview"
          description="テスト Test"
        />
      );
      expect(screen.getByText('プレビュー Preview')).toBeTruthy();
      expect(screen.getByText('テスト Test')).toBeTruthy();
    });

    it('should handle emojis in content', () => {
      render(
        <PreviewCard
          {...defaultProps}
          title="Sneak Peek 👀"
          description="Coming soon! 🎉"
        />
      );
      expect(screen.getByText('Sneak Peek 👀')).toBeTruthy();
      expect(screen.getByText('Coming soon! 🎉')).toBeTruthy();
    });

    it('should handle empty strings', () => {
      render(<PreviewCard {...defaultProps} title="" description="" />);
      expect(screen.getAllByText('').length).toBeGreaterThan(0);
    });

    it('should handle multiline description', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      render(<PreviewCard {...defaultProps} description={multilineDescription} />);
      expect(screen.getByText(multilineDescription)).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should render with all required props', () => {
      render(<PreviewCard {...defaultProps} />);
      expect(screen.getByText('Preview Video')).toBeTruthy();
      expect(screen.getByText('This is a preview description')).toBeTruthy();
    });

    it('should maintain consistent rendering', () => {
      const { rerender } = render(<PreviewCard {...defaultProps} />);
      expect(screen.getByText('Preview Video')).toBeTruthy();

      rerender(<PreviewCard {...defaultProps} title="Updated Title" />);
      expect(screen.getByText('Updated Title')).toBeTruthy();
    });
  });
});
