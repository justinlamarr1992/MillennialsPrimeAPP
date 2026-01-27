import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import Settings from '../Settings';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: {
      uid: 'test-user-id',
      email: 'testuser@example.com',
      displayName: 'Test User',
    },
    loading: false,
  })),
}));

// Mock useAxiosPrivate hook
jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock useProfilePictureUpload hook
jest.mock('@/hooks/useProfilePictureUpload', () => ({
  useProfilePictureUpload: jest.fn(() => ({
    profileImageUri: null,
    handleImageSelected: jest.fn(),
    isUploading: false,
  })),
}));

// Mock ProfilePicture component
jest.mock('@/components/ProfilePicture', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return jest.fn(() => {
    return React.createElement(View, { testID: 'mock-profile-picture' });
  });
});

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Screen Loads Successfully', () => {
    it('user should see Settings screen load without errors', () => {
      render(<Settings />);

      // User should see the Settings screen content
      expect(screen.getByText('Settings')).toBeTruthy();
      expect(screen.getByText('Hello, Test User')).toBeTruthy();
      expect(screen.getByText('testuser@example.com')).toBeTruthy();
    });
  });

  describe('Content Display', () => {
    it('should display greeting message with user name', () => {
      render(<Settings />);
      expect(screen.getByText('Hello, Test User')).toBeTruthy();
    });

    it('should display user email', () => {
      render(<Settings />);
      expect(screen.getByText('testuser@example.com')).toBeTruthy();
    });

    it('should display Settings title', () => {
      render(<Settings />);
      expect(screen.getByText('Settings')).toBeTruthy();
    });

    it('should display personal information button', () => {
      render(<Settings />);
      expect(screen.getByText('Personal Information')).toBeTruthy();
    });

    it('should display business information button', () => {
      render(<Settings />);
      expect(screen.getByText('Business Information')).toBeTruthy();
    });

    it('should display artistry information button', () => {
      render(<Settings />);
      expect(screen.getByText('Artistry Information')).toBeTruthy();
    });

    it('should display all three navigation buttons', () => {
      render(<Settings />);

      expect(screen.getByText('Personal Information')).toBeTruthy();
      expect(screen.getByText('Business Information')).toBeTruthy();
      expect(screen.getByText('Artistry Information')).toBeTruthy();
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to MyInfoScreen when personal information button is pressed', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledWith('/(tabs)/(settings)/MyInfoScreen');
    });

    it('should navigate to BusinessScreen when business information button is pressed', () => {
      render(<Settings />);

      const businessButton = screen.getByText('Business Information');
      fireEvent.press(businessButton);

      expect(router.push).toHaveBeenCalledWith('/(tabs)/(settings)/BusinessScreen');
    });

    it('should navigate to ArtScreen when artistry information button is pressed', () => {
      render(<Settings />);

      const artButton = screen.getByText('Artistry Information');
      fireEvent.press(artButton);

      expect(router.push).toHaveBeenCalledWith('/(tabs)/(settings)/ArtScreen');
    });

    it('should call router.push exactly once when personal info button is pressed', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledTimes(1);
    });

    it('should call router.push exactly once when business button is pressed', () => {
      render(<Settings />);

      const businessButton = screen.getByText('Business Information');
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
      const businessButton = screen.getByText('Business Information');
      const artButton = screen.getByText('Artistry Information');

      fireEvent.press(personalInfoButton);
      fireEvent.press(businessButton);
      fireEvent.press(artButton);

      expect(router.push).toHaveBeenCalledTimes(3);
      expect(router.push).toHaveBeenNthCalledWith(1, '/(tabs)/(settings)/MyInfoScreen');
      expect(router.push).toHaveBeenNthCalledWith(2, '/(tabs)/(settings)/BusinessScreen');
      expect(router.push).toHaveBeenNthCalledWith(3, '/(tabs)/(settings)/ArtScreen');
    });

    it('should handle rapid button presses on same button', () => {
      render(<Settings />);

      const personalInfoButton = screen.getByText('Personal Information');

      fireEvent.press(personalInfoButton);
      fireEvent.press(personalInfoButton);
      fireEvent.press(personalInfoButton);

      expect(router.push).toHaveBeenCalledTimes(3);
      expect(router.push).toHaveBeenCalledWith('/(tabs)/(settings)/MyInfoScreen');
    });
  });
});
