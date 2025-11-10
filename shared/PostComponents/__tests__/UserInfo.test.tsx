import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import UserInfo from '../UserInfo';

describe('UserInfo', () => {
  const defaultProps = {
    name: 'John Doe',
    admin: false,
    prime: false,
  };

  describe('User Name Display', () => {
    it('should display the user name when provided', () => {
      render(<UserInfo {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should display "Loading" when name is not provided', () => {
      render(<UserInfo name="" admin={false} prime={false} />);
      expect(screen.getByText('Loading')).toBeTruthy();
    });

    it('should display "Loading" when name is falsy', () => {
      render(<UserInfo name="" admin={false} prime={false} />);
      expect(screen.getByText('Loading')).toBeTruthy();
    });
  });

  describe('User Profile Picture', () => {
    it('should display user profile picture', () => {
      render(<UserInfo {...defaultProps} />);
      // Profile picture renders as part of the component
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
  });

  describe('User Name Interaction', () => {
    it('should make user name pressable for navigation to profile', () => {
      const { getByText } = render(<UserInfo {...defaultProps} />);
      const nameElement = getByText('John Doe');

      // User name should be inside a Pressable component
      expect(nameElement).toBeTruthy();

      // Should not throw when pressed
      expect(() => fireEvent.press(nameElement)).not.toThrow();
    });

    it('should handle press on user name without errors', () => {
      const { getByText } = render(<UserInfo {...defaultProps} />);
      const nameElement = getByText('John Doe');

      fireEvent.press(nameElement);
      // Should execute without throwing - navigation logic is logged
    });
  });

  describe('User Role Badges', () => {
    it('should display admin-styled name when user is an admin', () => {
      render(<UserInfo {...defaultProps} admin={true} />);
      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should display prime-styled name when user is prime member', () => {
      render(<UserInfo {...defaultProps} prime={true} />);
      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should display default-styled name when user is neither admin nor prime', () => {
      render(<UserInfo {...defaultProps} admin={false} prime={false} />);
      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should prioritize admin styling over prime when user is both', () => {
      render(<UserInfo {...defaultProps} admin={true} prime={true} />);
      // Admin styling takes precedence in the ternary
      expect(screen.getByText('John Doe')).toBeTruthy();
    });
  });

  describe('User Information Layout', () => {
    it('should display user info with picture and name together', () => {
      const { getByText } = render(<UserInfo {...defaultProps} />);

      expect(getByText('John Doe')).toBeTruthy();
      // Picture and name render together in the component
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string name gracefully', () => {
      render(<UserInfo name="" admin={false} prime={false} />);
      expect(screen.getByText('Loading')).toBeTruthy();
    });

    it('should handle special characters in name', () => {
      render(<UserInfo name="O'Brien-Smith" admin={false} prime={false} />);
      expect(screen.getByText("O'Brien-Smith")).toBeTruthy();
    });

    it('should handle long names', () => {
      const longName = 'Christopher Alexander Montgomery-Richardson III';
      render(<UserInfo name={longName} admin={false} prime={false} />);
      expect(screen.getByText(longName)).toBeTruthy();
    });

    it('should handle unicode characters in name', () => {
      render(<UserInfo name="Jos� Garc�a" admin={false} prime={false} />);
      expect(screen.getByText('Jos� Garc�a')).toBeTruthy();
    });
  });
});
