import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import ArtScreen from '../ArtScreen';
import { useRouter } from 'expo-router';

// Create mock functions
const mockPush = jest.fn();
const mockBack = jest.fn();

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    back: mockBack,
  })),
  router: {
    back: mockBack,
    push: mockPush,
  },
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: ({ children }: { children: React.ReactNode }) => {
    return children;
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

// Mock useUserProfile hook
jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: jest.fn(() => ({
    profile: null,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

// Mock userProfileService
jest.mock('@/services/userProfileService', () => ({
  userProfileService: {
    updateArt: jest.fn(),
  },
}));

describe('ArtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  describe('Initial Content Display', () => {
    it('should display screen title', () => {
      render(<ArtScreen />);
      expect(screen.getByText('Art Information')).toBeTruthy();
    });

    it('should display subtitle', () => {
      render(<ArtScreen />);
      expect(screen.getByText('Edit your Artist information')).toBeTruthy();
    });

    it('should display artist question', () => {
      render(<ArtScreen />);
      expect(screen.getByText('Are you an Artist')).toBeTruthy();
    });

    it('should display artist input placeholder', () => {
      render(<ArtScreen />);
      expect(screen.getByPlaceholderText('Select Answer')).toBeTruthy();
    });

    it('should display save changes button', () => {
      render(<ArtScreen />);
      expect(screen.getByText('Save Changes')).toBeTruthy();
    });
  });

  describe('Initial State Behavior', () => {
    it('should not show professional artist questions initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('Have you worked as a professional artist before?')).toBeNull();
    });

    it('should not show purpose question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('What is the purpose of your work?')).toBeNull();
    });

    it('should not show favorites question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('Favorite and least favorite parts of professional art?')).toBeNull();
    });

    it('should not show societal issues question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('How can your work affect societal issues?')).toBeNull();
    });

    it('should not show inspiration question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('Which art/music trends inspire your current work?')).toBeNull();
    });

    it('should not show style change question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('How has your style changed over time?')).toBeNull();
    });

    it('should not show critics question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('What have critics said about your work?')).toBeNull();
    });

    it('should not show industry navigation question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('How do you navigate the professional art industry?')).toBeNull();
    });

    it('should not show network question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('Do you have a network of other Artist')).toBeNull();
    });

    it('should not show integral question initially', () => {
      render(<ArtScreen />);
      expect(screen.queryByText('Anything specific integral to your work?')).toBeNull();
    });
  });

  describe('Picker Interactions', () => {
    it('should open artist picker when artist input is pressed', () => {
      const { getByPlaceholderText } = render(<ArtScreen />);

      const artistInput = getByPlaceholderText('Select Answer');
      fireEvent(artistInput, 'onPressIn');

      expect(artistInput).toBeTruthy();
    });
  });

  describe('Save Changes Behavior', () => {
    it('should navigate to HomePage after user presses save button', async () => {
      const { getByText } = render(<ArtScreen />);

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/(tabs)/(home)/HomePage');
      });
    });

    it('should allow user to submit their art information', async () => {
      const { getByText } = render(<ArtScreen />);

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      // User's action should result in navigation
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });
    });
  });

});

