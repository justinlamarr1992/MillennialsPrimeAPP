import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import CustomBottomSheet from '../CustomBottomSheet';

describe('CustomBottomSheet', () => {
  const defaultProps = {
    title: 'Test Bottom Sheet',
  };

  describe('Bottom Sheet Content Display', () => {
    it('should display bottom sheet title', () => {
      render(<CustomBottomSheet {...defaultProps} />);
      expect(screen.getByText('Test Bottom Sheet')).toBeTruthy();
    });
  });

  describe('Title Variations', () => {
    it('should display short title', () => {
      render(<CustomBottomSheet title="Hi" />);
      expect(screen.getByText('Hi')).toBeTruthy();
    });

    it('should display long title', () => {
      const longTitle = 'This is a very long title for the bottom sheet modal';
      render(<CustomBottomSheet title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Options & Settings!';
      render(<CustomBottomSheet title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters in title', () => {
      const unicodeTitle = 'オプション Options';
      render(<CustomBottomSheet title={unicodeTitle} />);
      expect(screen.getByText(unicodeTitle)).toBeTruthy();
    });

    it('should handle emojis in title', () => {
      const emojiTitle = 'Settings ⚙️';
      render(<CustomBottomSheet title={emojiTitle} />);
      expect(screen.getByText(emojiTitle)).toBeTruthy();
    });

    it('should handle empty title', () => {
      render(<CustomBottomSheet title="" />);
      expect(screen.getByText('')).toBeTruthy();
    });
  });
});
