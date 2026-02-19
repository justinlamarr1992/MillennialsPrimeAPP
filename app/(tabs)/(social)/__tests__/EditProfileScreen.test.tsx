import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import { Alert } from 'react-native';
import EditProfileScreen from '../EditProfileScreen';
import { userProfileService } from '@/services/userProfileService';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
}));

const { router } = require('expo-router');
const mockBack = router.back as jest.Mock;

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock ProfilePicture component
jest.mock('@/components/ProfilePicture', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pressable, Text } = require('react-native');
  return jest.fn((props) => {
    return React.createElement(
      Pressable,
      {
        testID: 'mock-profile-picture',
        onPress: () => props.onImageSelected('file:///path/to/image.jpg'),
      },
      React.createElement(Text, {}, 'Mock Profile Picture')
    );
  });
});

// Mock TagInput component
jest.mock('@/components/TagInput', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, TextInput, Text } = require('react-native');
  return jest.fn((props) => {
    return React.createElement(
      View,
      { testID: 'mock-tag-input' },
      React.createElement(TextInput, {
        testID: 'tag-input-field',
        placeholder: props.placeholder,
        onChangeText: (text: string) => {
          if (text) {
            props.onTagsChange([...props.tags, text]);
          }
        },
      }),
      props.tags.map((tag: string) =>
        React.createElement(Text, { key: tag }, tag)
      )
    );
  });
});

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
const mockRefetch = jest.fn();
jest.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: jest.fn(() => ({
    profile: null,
    loading: false,
    error: null,
    refetch: mockRefetch,
  })),
}));

const { useUserProfile: mockUseUserProfile } = require('@/hooks/useUserProfile');

// Mock useAxiosPrivate hook
jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock useProfilePictureUpload hook
const mockHandleImageSelected = jest.fn();
jest.mock('@/hooks/useProfilePictureUpload', () => ({
  useProfilePictureUpload: jest.fn(() => ({
    profileImageUri: null,
    handleImageSelected: mockHandleImageSelected,
    isUploading: false,
  })),
}));

// Mock userProfileService
jest.mock('@/services/userProfileService', () => ({
  userProfileService: {
    updateEditProfile: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleImageSelected.mockClear();
    mockRefetch.mockClear();
    mockBack.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    (userProfileService.updateEditProfile as jest.Mock).mockResolvedValue({});
  });

  describe('Initial Content Display', () => {
    it('should display screen title', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });

    it('should display subtitle', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Update your profile information')).toBeTruthy();
    });

    it('should display save changes button', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Save Changes')).toBeTruthy();
    });

  });

  describe('Basic Information Fields', () => {
    it('should display name label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Name')).toBeTruthy();
    });

    it('should display name input placeholder', () => {
      render(<EditProfileScreen />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
    });

    it('should display bio label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Bio')).toBeTruthy();
    });

    it('should display bio input placeholder', () => {
      render(<EditProfileScreen />);
      expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeTruthy();
    });

    it('should display bio character counter', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('0/200 characters')).toBeTruthy();
    });
  });

  describe('Location Fields', () => {
    it('should display city label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('City')).toBeTruthy();
    });

    it('should display city input placeholder', () => {
      render(<EditProfileScreen />);
      expect(screen.getByPlaceholderText('Enter city')).toBeTruthy();
    });

    it('should display state label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('State')).toBeTruthy();
    });

    it('should display state input placeholder', () => {
      render(<EditProfileScreen />);
      expect(screen.getByPlaceholderText('Enter state')).toBeTruthy();
    });

    it('should display country label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Country')).toBeTruthy();
    });

    it('should display country input placeholder', () => {
      render(<EditProfileScreen />);
      expect(screen.getByPlaceholderText('Enter country')).toBeTruthy();
    });
  });

  describe('Interests Section', () => {
    it('should display interests label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Interests')).toBeTruthy();
    });

    it('should display interests helper text', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Add topics you\'re interested in (max 10)')).toBeTruthy();
    });

    it('should render TagInput component', () => {
      render(<EditProfileScreen />);
      expect(screen.getByTestId('mock-tag-input')).toBeTruthy();
    });
  });

  describe('B2B Opportunities Section', () => {
    it('should display B2B opportunities label', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('B2B Opportunities')).toBeTruthy();
    });

    it('should display B2B opportunities description', () => {
      render(<EditProfileScreen />);
      expect(screen.getByText('Open to business collaborations')).toBeTruthy();
    });
  });

  describe('Form Input Behavior', () => {
    it('should handle name input changes', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'Jane Doe');

      expect(nameInput.props.value).toBe('Jane Doe');
    });

    it('should handle bio input changes', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      fireEvent.changeText(bioInput, 'I am a software developer');

      expect(bioInput.props.value).toBe('I am a software developer');
    });

    it('should handle city input changes', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const cityInput = getByPlaceholderText('Enter city');
      fireEvent.changeText(cityInput, 'San Francisco');

      expect(cityInput.props.value).toBe('San Francisco');
    });

    it('should handle state input changes', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const stateInput = getByPlaceholderText('Enter state');
      fireEvent.changeText(stateInput, 'California');

      expect(stateInput.props.value).toBe('California');
    });

    it('should handle country input changes', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const countryInput = getByPlaceholderText('Enter country');
      fireEvent.changeText(countryInput, 'United States');

      expect(countryInput.props.value).toBe('United States');
    });
  });

  describe('Bio Character Counter', () => {
    it('should update character count when bio changes', () => {
      const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      fireEvent.changeText(bioInput, 'Hello World');

      expect(getByText('11/200 characters')).toBeTruthy();
    });

    it('should count trimmed length for character count', () => {
      const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      fireEvent.changeText(bioInput, '  Hello  ');

      expect(getByText('5/200 characters')).toBeTruthy();
    });

    it('should enforce 200 character maxLength on bio input', () => {
      const { getByPlaceholderText } = render(<EditProfileScreen />);

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      expect(bioInput.props.maxLength).toBe(200);
    });
  });


  describe('Profile Data Population', () => {
    it('should populate form fields when profile data is available', () => {
      mockUseUserProfile.mockReturnValue({
        profile: {
          name: 'John Smith',
          bio: 'Software engineer',
          location: {
            city: 'Austin',
            state: 'Texas',
            country: 'USA',
          },
          interests: ['coding', 'music'],
          b2bOpportunities: true,
        },
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { getByPlaceholderText } = render(<EditProfileScreen />);

      expect(getByPlaceholderText('Enter your name').props.value).toBe('John Smith');
      expect(getByPlaceholderText('Tell us about yourself...').props.value).toBe('Software engineer');
      expect(getByPlaceholderText('Enter city').props.value).toBe('Austin');
      expect(getByPlaceholderText('Enter state').props.value).toBe('Texas');
      expect(getByPlaceholderText('Enter country').props.value).toBe('USA');
    });

    it('should handle profile with missing location data', () => {
      mockUseUserProfile.mockReturnValue({
        profile: {
          name: 'Jane Doe',
          bio: 'Designer',
          location: {},
          interests: [],
          b2bOpportunities: false,
        },
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { getByPlaceholderText } = render(<EditProfileScreen />);

      expect(getByPlaceholderText('Enter city').props.value).toBe('');
      expect(getByPlaceholderText('Enter state').props.value).toBe('');
      expect(getByPlaceholderText('Enter country').props.value).toBe('');
    });

    it('should handle profile with null values', () => {
      mockUseUserProfile.mockReturnValue({
        profile: {
          name: null,
          bio: null,
          location: null,
          interests: null,
          b2bOpportunities: null,
        },
        loading: false,
        error: null,
        refetch: mockRefetch,
      });

      const { getByPlaceholderText } = render(<EditProfileScreen />);

      expect(getByPlaceholderText('Enter your name').props.value).toBe('');
      expect(getByPlaceholderText('Tell us about yourself...').props.value).toBe('');
    });
  });


  describe('Profile Picture Integration', () => {
    it('should render ProfilePicture component', () => {
      render(<EditProfileScreen />);
      expect(screen.getByTestId('mock-profile-picture')).toBeTruthy();
    });

    it('should call handleImageSelected when profile picture is pressed', () => {
      const { getByTestId } = render(<EditProfileScreen />);

      const mockProfilePicture = getByTestId('mock-profile-picture');
      fireEvent.press(mockProfilePicture);

      expect(mockHandleImageSelected).toHaveBeenCalledWith('file:///path/to/image.jpg');
    });
  });

  describe('Form Validation', () => {
    it('should show alert when name is empty', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      // Clear name field
      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, '');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validation Error',
          expect.stringContaining('Name is required')
        );
      });
    });


    it('should not submit when validation fails', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, '');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(userProfileService.updateEditProfile).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission Success', () => {
    it('should call updateEditProfile with correct data on valid submission', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      fireEvent.changeText(bioInput, 'Software developer');

      const cityInput = getByPlaceholderText('Enter city');
      fireEvent.changeText(cityInput, 'San Francisco');

      const stateInput = getByPlaceholderText('Enter state');
      fireEvent.changeText(stateInput, 'California');

      const countryInput = getByPlaceholderText('Enter country');
      fireEvent.changeText(countryInput, 'USA');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(userProfileService.updateEditProfile).toHaveBeenCalledWith({
            name: 'John Doe',
            bio: 'Software developer',
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
            interests: [],
            b2bOpportunities: false,
          });
        },
        { timeout: 3000 }
      );
    });

    it('should refetch profile after successful submission', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(mockRefetch).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });

    it('should show success alert after successful submission', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            'Success',
            'Your profile has been updated!'
          );
        },
        { timeout: 3000 }
      );
    });

    it('should navigate back after successful submission', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(mockBack).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Form Submission Error', () => {
    it('should show error alert when submission fails', async () => {
      (userProfileService.updateEditProfile as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Failed to save profile. Please try again.'
          );
        },
        { timeout: 3000 }
      );
    });

    it('should not navigate back when submission fails', async () => {
      (userProfileService.updateEditProfile as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Failed to save profile. Please try again.'
          );
        },
        { timeout: 3000 }
      );

      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should not refetch profile when submission fails', async () => {
      (userProfileService.updateEditProfile as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Failed to save profile. Please try again.'
          );
        },
        { timeout: 3000 }
      );

      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty interests array', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(userProfileService.updateEditProfile).toHaveBeenCalledWith(
            expect.objectContaining({
              interests: [],
            })
          );
        },
        { timeout: 3000 }
      );
    });

    it('should trim whitespace from bio for validation', async () => {
      const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);

      const nameInput = getByPlaceholderText('Enter your name');
      fireEvent.changeText(nameInput, 'John Doe');

      const bioInput = getByPlaceholderText('Tell us about yourself...');
      fireEvent.changeText(bioInput, '   Only whitespace gets trimmed   ');

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      await waitFor(
        () => {
          expect(userProfileService.updateEditProfile).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });
});
