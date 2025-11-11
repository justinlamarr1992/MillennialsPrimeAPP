import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import Settings from '../Settings';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

import { router } from 'expo-router';

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Content Display', () => {
    it('should display greeting message', () => {
      render(<Settings />);
      expect(screen.getByText('Hello, (Name here)')).toBeTruthy();
    });

    it('should display personal information button', () => {
      render(<Settings />);
      expect(screen.getByText('Personal Information')).toBeTruthy();
    });

    it('should display business information button', () => {
      render(<Settings />);
      expect(screen.getByText('Business Infomation')).toBeTruthy();
    });

    it('should display artistry information button', () => {
      render(<Settings />);
      expect(screen.getByText('Artistry Information')).toBeTruthy();
    });

    it('should display all three navigation buttons', () => {
      render(<Settings />);

      expect(screen.getByText('Personal Information')).toBeTruthy();
      expect(screen.getByText('Business Infomation')).toBeTruthy();
      expect(screen.getByText('Artistry Information')).toBeTruthy();
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to MyInfoScreen when personal information button is pressed', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledWith('/MyInfoScreen');
    });

    it('should navigate to BusinessScreen when business information button is pressed', () => {
      render(<Settings />);

      const businessButton = screen.getByText('Business Infomation');
      fireEvent.press(businessButton);

      expect(router.push).toHaveBeenCalledWith('/BusinessScreen');
    });

    it('should navigate to ArtScreen when artistry information button is pressed', () => {
      render(<Settings />);

      const artButton = screen.getByText('Artistry Information');
      fireEvent.press(artButton);

      expect(router.push).toHaveBeenCalledWith('/ArtScreen');
    });

    it('should call router.push exactly once when personal info button is pressed', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledTimes(1);
    });

    it('should call router.push exactly once when business button is pressed', () => {
      render(<Settings />);

      const businessButton = screen.getByText('Business Infomation');
      fireEvent.press(businessButton);

      expect(router.push).toHaveBeenCalledTimes(1);
    });

    it('should call router.push exactly once when art button is pressed', () => {
      render(<Settings />);

      const artButton = screen.getByText('Artistry Information');
      fireEvent.press(artButton);

      expect(router.push).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interaction Flow', () => {
    it('should handle multiple button presses in sequence', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');
      const businessButton = screen.getByText('Business Infomation');
      const artButton = screen.getByText('Artistry Information');

      fireEvent.press(personalInfoButton);
      fireEvent.press(businessButton);
      fireEvent.press(artButton);

      expect(router.push).toHaveBeenCalledTimes(3);
      expect(router.push).toHaveBeenNthCalledWith(1, '/MyInfoScreen');
      expect(router.push).toHaveBeenNthCalledWith(2, '/BusinessScreen');
      expect(router.push).toHaveBeenNthCalledWith(3, '/ArtScreen');
    });

    it('should handle rapid button presses on same button', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');

      fireEvent.press(personalInfoButton);
      fireEvent.press(personalInfoButton);
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledTimes(3);
      expect(router.push).toHaveBeenCalledWith('/MyInfoScreen');
    });
  });
});
