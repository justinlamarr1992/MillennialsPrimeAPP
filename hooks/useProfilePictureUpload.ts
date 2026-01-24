import { useState, useEffect } from 'react';
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
      } catch (error: any) {
        // 408 from server means no profile picture exists yet - this is normal
        if (error?.response?.status === 408) {
          if (__DEV__) {
            logger.log('ℹ️ No profile picture found - user can upload one');
          }
        } else {
          // Actual error loading picture
          logger.error('❌ Failed to load profile picture:', error);
        }
        // Don't throw - allow screen to render without picture
      }
    };

    if (user) {
      void loadProfilePicture();
    }
  }, [user]);

  // Handle profile picture upload when user selects a new image
  const handleImageSelected = async (uri: string) => {
    try {
      setIsUploading(true);
      logger.log('📤 Starting profile picture upload process...');
      logger.log('📁 Image URI:', uri);

      // Update UI immediately
      setProfileImageUri(uri);

      // Convert image URI to base64 using expo-file-system
      logger.log('🔄 Reading image as base64...');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      logger.log('✅ Base64 conversion complete, length:', base64.length);

      // Add data URL prefix for the image type
      const base64WithPrefix = `data:image/jpeg;base64,${base64}`;
      logger.log('✅ Added data URL prefix, total length:', base64WithPrefix.length);

      logger.log('📤 Uploading base64 image to server...');
      await userProfileService.uploadProfilePicture(base64WithPrefix);

      logger.log('✅ Profile picture uploaded successfully');
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
  };

  return {
    profileImageUri,
    handleImageSelected,
    isUploading,
  };
}
