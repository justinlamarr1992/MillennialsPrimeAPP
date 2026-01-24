import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useProfilePictureUpload } from '../useProfilePictureUpload';
import { userProfileService } from '@/services/userProfileService';
import useAuth from '../useAuth';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('@/services/userProfileService');
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

describe('useProfilePictureUpload', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    });
    const FileSystem = require('expo-file-system');
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('mockBase64Data');
  });

  describe('When user opens a screen with profile picture', () => {
    it('user should see their existing profile picture if they have one', async () => {
      const existingPictureUri = 'data:image/jpeg;base64,existingimage';
      (userProfileService.getProfilePicture as jest.Mock).mockResolvedValue(existingPictureUri);

      const { result } = renderHook(() => useProfilePictureUpload());

      await waitFor(() => {
        expect(result.current.profileImageUri).toBe(existingPictureUri);
      });
    });

    it('user should see placeholder when they have no profile picture', async () => {
      const error = { response: { status: 408 } };
      (userProfileService.getProfilePicture as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useProfilePictureUpload());

      await waitFor(() => {
        expect(result.current.profileImageUri).toBeNull();
      });
    });

    it('user should still see screen even if picture fails to load', async () => {
      const error = new Error('Network error');
      (userProfileService.getProfilePicture as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useProfilePictureUpload());

      await waitFor(() => {
        // Hook should not crash, user can still use the screen
        expect(result.current.profileImageUri).toBeNull();
      });
    });
  });

  describe('When user selects a new profile picture', () => {
    const selectedImageUri = 'file:///path/to/selected/image.jpg';

    beforeEach(() => {
      // Mock initial profile picture load to return null (no existing picture)
      (userProfileService.getProfilePicture as jest.Mock).mockResolvedValue(null);

      // Ensure FileSystem mock is properly set up for base64 conversion
      const FileSystem = require('expo-file-system');
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('mockBase64Data');
    });

    it('user should immediately see the selected image in the UI', async () => {
      (userProfileService.uploadProfilePicture as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useProfilePictureUpload());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(userProfileService.getProfilePicture).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.handleImageSelected(selectedImageUri);
      });

      expect(result.current.profileImageUri).toBe(selectedImageUri);
    });

    it('user should see a success message when their picture uploads successfully', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      (userProfileService.uploadProfilePicture as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useProfilePictureUpload());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(userProfileService.getProfilePicture).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.handleImageSelected(selectedImageUri);
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Success', 'Profile picture updated!');
      });
    });

    it('user should see an error message when upload fails', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      (userProfileService.uploadProfilePicture as jest.Mock).mockRejectedValue(
        new Error('Upload failed')
      );

      const { result } = renderHook(() => useProfilePictureUpload());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(userProfileService.getProfilePicture).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.handleImageSelected(selectedImageUri);
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to upload profile picture. Please try again.');
      });
    });

    it('user should see their previous picture again if upload fails', async () => {
      const previousPictureUri = 'data:image/jpeg;base64,previousimage';
      (userProfileService.getProfilePicture as jest.Mock).mockResolvedValue(previousPictureUri);
      (userProfileService.uploadProfilePicture as jest.Mock).mockRejectedValue(
        new Error('Upload failed')
      );

      const { result } = renderHook(() => useProfilePictureUpload());

      // Wait for initial picture to load
      await waitFor(() => {
        expect(result.current.profileImageUri).toBe(previousPictureUri);
      });

      // User selects new picture but upload fails
      await act(async () => {
        await result.current.handleImageSelected(selectedImageUri);
      });

      // User should see their previous picture again after failure
      await waitFor(() => {
        expect(result.current.profileImageUri).toBe(previousPictureUri);
      });
    });

    it('user should see an error message when selected photo cannot be processed', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const FileSystem = require('expo-file-system');
      (FileSystem.readAsStringAsync as jest.Mock).mockRejectedValue(new Error('Cannot read file'));

      const { result } = renderHook(() => useProfilePictureUpload());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(userProfileService.getProfilePicture).toHaveBeenCalled();
      });

      await act(async () => {
        await result.current.handleImageSelected(selectedImageUri);
      });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Failed to upload profile picture. Please try again.');
      });
    });
  });
});
