import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { logger } from '@/utils/logger';
import { userProfileService } from '@/services/userProfileService';
import useAuth from './useAuth';

/**
 * Custom hook for managing profile picture upload
 * Handles loading from server, converting to base64, and uploading
 */
export function useProfilePictureUpload() {
  const { user } = useAuth();
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load profile picture from server on mount
  useEffect(() => {
    const loadProfilePicture = async () => {
      try {
        const pictureUri = await userProfileService.getProfilePicture();
        if (pictureUri) {
          setProfileImageUri(pictureUri);
          if (__DEV__) {
            logger.log('✅ Profile picture loaded from server');
          }
        }
      } catch (error: unknown) {
        // 408 from server means no profile picture exists yet - this is normal
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 408) {
            if (__DEV__) {
              logger.log('ℹ️ No profile picture found - user can upload one');
            }
            return;
          }
        }
        // Actual error loading picture
        logger.error('❌ Failed to load profile picture:', error);
        // Don't throw - allow screen to render without picture
      }
    };

    if (user) {
      void loadProfilePicture();
    }
  }, [user]);

  // Handle profile picture upload when user selects a new image
  const handleImageSelected = useCallback(async (uri: string) => {
    try {
      setIsUploading(true);
      if (__DEV__) {
        logger.log('📤 Starting profile picture upload process...');
        logger.log('📁 Image URI:', uri);
      }

      // Update UI immediately
      setProfileImageUri(uri);

      // Convert image URI to base64 using expo-file-system
      if (__DEV__) {
        logger.log('🔄 Reading image as base64...');
      }
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (__DEV__) {
        logger.log('✅ Base64 conversion complete, length:', base64.length);
      }

      // Add data URL prefix for the image type
      // Note: Using image/jpeg as MIME type. Images will be converted to JPEG format server-side.
      const base64WithPrefix = `data:image/jpeg;base64,${base64}`;
      if (__DEV__) {
        logger.log('✅ Added data URL prefix, total length:', base64WithPrefix.length);
      }

      if (__DEV__) {
        logger.log('📤 Uploading base64 image to server...');
      }
      await userProfileService.uploadProfilePicture(base64WithPrefix);

      if (__DEV__) {
        logger.log('✅ Profile picture uploaded successfully');
      }
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      logger.error('❌ Failed to upload profile picture:', error);
      if (error instanceof Error) {
        logger.error('Error message:', error.message);
        logger.error('Error stack:', error.stack);
      }
      Alert.alert('Error', 'Failed to upload profile picture. Please try again.');

      // Revert to previous image on error
      try {
        const previousUri = await userProfileService.getProfilePicture();
        setProfileImageUri(previousUri);
      } catch {
        // If we can't load previous image, just set to null
        setProfileImageUri(null);
      }
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    profileImageUri,
    handleImageSelected,
    isUploading,
  };
}
