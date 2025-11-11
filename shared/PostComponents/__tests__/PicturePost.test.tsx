import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import PicturePost from '../PicturePost';

describe('PicturePost', () => {
  const defaultProps = {
    name: 'Jane Smith',
    title: 'Beautiful Sunset',
    description: 'A stunning sunset over the mountains',
    picture: 'https://example.com/sunset.jpg',
    prime: false,
    admin: false,
  };

  describe('Picture Content Display', () => {
    it('should display hardcoded name "Picture post Name Here"', () => {
      render(<PicturePost {...defaultProps} />);
      expect(screen.getByText('Picture post Name Here')).toBeTruthy();
    });

    it('should display picture title', () => {
      render(<PicturePost {...defaultProps} />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
    });

    it('should display picture description', () => {
      render(<PicturePost {...defaultProps} />);
      expect(screen.getByText('A stunning sunset over the mountains')).toBeTruthy();
    });

    it('should display "No Title yet" when title is empty', () => {
      render(<PicturePost {...defaultProps} title="" />);
      expect(screen.getByText('No Title yet')).toBeTruthy();
    });

    it('should display "No description Yet" when description is empty', () => {
      render(<PicturePost {...defaultProps} description="" />);
      expect(screen.getByText('No description Yet')).toBeTruthy();
    });
  });

  describe('User Role Display', () => {
    it('should render picture post for admin user', () => {
      render(<PicturePost {...defaultProps} admin={true} />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
      expect(screen.getByText('A stunning sunset over the mountains')).toBeTruthy();
    });

    it('should render picture post for prime member', () => {
      render(<PicturePost {...defaultProps} prime={true} />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
      expect(screen.getByText('A stunning sunset over the mountains')).toBeTruthy();
    });

    it('should render picture post for regular user', () => {
      render(<PicturePost {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
      expect(screen.getByText('A stunning sunset over the mountains')).toBeTruthy();
    });
  });

  describe('Picture Content Edge Cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(500);
      render(<PicturePost {...defaultProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(1000);
      render(<PicturePost {...defaultProps} description={longDescription} />);
      expect(screen.getByText(longDescription)).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Amazing Photo & Special Characters';
      render(<PicturePost {...defaultProps} title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      render(
        <PicturePost
          {...defaultProps}
          title="写真 Photo"
          description="Beautiful scene 美しい"
        />
      );
      expect(screen.getByText('写真 Photo')).toBeTruthy();
      expect(screen.getByText('Beautiful scene 美しい')).toBeTruthy();
    });

    it('should handle emojis in content', () => {
      render(
        <PicturePost
          {...defaultProps}
          title="Stunning View 📷"
          description="Nature at its best 🌄"
        />
      );
      expect(screen.getByText('Stunning View 📷')).toBeTruthy();
      expect(screen.getByText('Nature at its best 🌄')).toBeTruthy();
    });

    it('should handle multiline description', () => {
      const multilineDescription = 'First line\nSecond line\nThird line';
      render(<PicturePost {...defaultProps} description={multilineDescription} />);
      expect(screen.getByText(multilineDescription)).toBeTruthy();
    });
  });

  describe('Picture URL Handling', () => {
    it('should render with valid picture URL', () => {
      render(<PicturePost {...defaultProps} picture="https://example.com/image.jpg" />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
    });

    it('should render with empty picture URL', () => {
      render(<PicturePost {...defaultProps} picture="" />);
      expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
    });

    it('should render with different image formats', () => {
      const formats = [
        'https://example.com/image.png',
        'https://example.com/image.webp',
        'https://example.com/image.gif',
      ];

      formats.forEach((format) => {
        const { unmount } = render(<PicturePost {...defaultProps} picture={format} />);
        expect(screen.getByText('Beautiful Sunset')).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Required Props', () => {
    it('should render with all required props', () => {
      render(
        <PicturePost
          name="Test User"
          title="Test Title"
          description="Test Description"
          picture="https://example.com/test.jpg"
          prime={false}
          admin={false}
        />
      );
      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('should render with minimal content', () => {
      render(
        <PicturePost
          name=""
          title="Only Title"
          description=""
          picture="https://example.com/test.jpg"
          prime={false}
          admin={false}
        />
      );
      expect(screen.getByText('Only Title')).toBeTruthy();
      expect(screen.getByText('No description Yet')).toBeTruthy();
    });
  });
});
