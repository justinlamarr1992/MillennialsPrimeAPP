import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import ProfilePicture from '../ProfilePicture';
import * as ImagePicker from 'expo-image-picker';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ProfilePicture', () => {
  const mockOnImageSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User sees appropriate UI based on state', () => {
    it('shows "Tap to add photo" when no image and editable', () => {
      render(
        <ProfilePicture imageUri={null} onImageSelected={mockOnImageSelected} />
      );
      expect(screen.getByText('Tap to add photo')).toBeTruthy();
    });

    it('hides placeholder text when image is provided', () => {
      const testUri = 'https://example.com/test-image.jpg';
      render(
        <ProfilePicture
          imageUri={testUri}
          onImageSelected={mockOnImageSelected}
        />
      );

      expect(screen.queryByText('Tap to add photo')).toBeNull();
    });

    it('shows placeholder when imageUri is a raw ID instead of a valid URI', () => {
      render(
        <ProfilePicture
          imageUri="6988bc396a977b0030ea7b9e"
          onImageSelected={mockOnImageSelected}
        />
      );

      expect(screen.getByText('Tap to add photo')).toBeTruthy();
    });

    it('shows edit button when editable', () => {
      render(
        <ProfilePicture
          imageUri={null}
          onImageSelected={mockOnImageSelected}
          editable={true}
        />
      );
      expect(screen.getByText('✎')).toBeTruthy();
    });

    it('hides edit button when not editable', () => {
      render(
        <ProfilePicture
          imageUri={null}
          onImageSelected={mockOnImageSelected}
          editable={false}
        />
      );
      expect(screen.queryByText('✎')).toBeNull();
    });

    it('shows "No photo" text when not editable and no image', () => {
      render(
        <ProfilePicture
          imageUri={null}
          onImageSelected={mockOnImageSelected}
          editable={false}
        />
      );
      expect(screen.getByText('No photo')).toBeTruthy();
    });
  });

  describe('User can select an image', () => {
    it('calls callback with selected image URI when user picks an image', async () => {
      const mockUri = 'file:///path/to/image.jpg';
      const mockPermissionResult = { status: 'granted' as const };
      const mockImageResult = {
        canceled: false,
        assets: [{ uri: mockUri }],
      };

      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissionResult
      );
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockImageResult
      );

      render(
        <ProfilePicture imageUri={null} onImageSelected={mockOnImageSelected} />
      );

      const placeholder = screen.getByText('Tap to add photo');
      fireEvent.press(placeholder);

      await screen.findByText('Tap to add photo');
      expect(mockOnImageSelected).toHaveBeenCalledWith(mockUri);
    });

    it('does not call callback when permission is denied', async () => {
      const mockPermissionResult = { status: 'denied' as const };
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissionResult
      );

      render(
        <ProfilePicture imageUri={null} onImageSelected={mockOnImageSelected} />
      );

      const placeholder = screen.getByText('Tap to add photo');
      fireEvent.press(placeholder);

      await screen.findByText('Tap to add photo');
      expect(mockOnImageSelected).not.toHaveBeenCalled();
    });

    it('does not call callback when user cancels selection', async () => {
      const mockPermissionResult = { status: 'granted' as const };
      const mockImageResult = { canceled: true };

      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissionResult
      );
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockImageResult
      );

      render(
        <ProfilePicture imageUri={null} onImageSelected={mockOnImageSelected} />
      );

      const placeholder = screen.getByText('Tap to add photo');
      fireEvent.press(placeholder);

      await screen.findByText('Tap to add photo');
      expect(mockOnImageSelected).not.toHaveBeenCalled();
    });

    it('does not allow image selection when not editable', async () => {
      render(
        <ProfilePicture
          imageUri={null}
          onImageSelected={mockOnImageSelected}
          editable={false}
        />
      );

      const placeholder = screen.getByText('No photo');
      fireEvent.press(placeholder);

      expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  describe('User can press edit button to select image', () => {
    it('allows user to select image via edit button', async () => {
      const mockUri = 'file:///path/to/new-image.jpg';
      const mockPermissionResult = { status: 'granted' as const };
      const mockImageResult = {
        canceled: false,
        assets: [{ uri: mockUri }],
      };

      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissionResult
      );
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockImageResult
      );

      render(
        <ProfilePicture imageUri={null} onImageSelected={mockOnImageSelected} />
      );

      const editButton = screen.getByText('✎');
      fireEvent.press(editButton);

      await screen.findByText('✎');
      expect(mockOnImageSelected).toHaveBeenCalledWith(mockUri);
    });
  });
});
