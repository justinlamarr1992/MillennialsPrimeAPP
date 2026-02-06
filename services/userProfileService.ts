/**
 * Service for managing user profile data with the server
 *
 * IMPORTANT: Server expects data wrapped in `values` object for all update endpoints.
 * See server/controllers/userController.js for expected request formats.
 */

import { axiosPrivate } from '@/API/axios';
import { serverAuth } from './serverAuth';
import { logger } from '@/utils/logger';
import type {
  ServerUserProfile,
  MyInfoFormData,
  BusinessFormData,
  ArtFormData,
  EditProfileFormData,
} from '@/types/UserProfile';

export const userProfileService = {
  /**
   * Fetch complete user profile from server
   */
  async fetchProfile(): Promise<ServerUserProfile> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const response = await axiosPrivate.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update basic profile info (MyInfoScreen data)
   * Server expects: req.body.values.{name, email, DOB, country, state, city, zip}
   */
  async updateMyInfo(data: MyInfoFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const parsedZip = Number.parseInt(data.zip, 10);
    const payload = {
      values: {
        name: data.name,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: Number.isNaN(parsedZip) ? undefined : parsedZip,
      },
    };

    if (__DEV__) {
      logger.log('💾 Updating profile for user:', userId);
      logger.log('📦 Update payload:', JSON.stringify(payload));
    }

    try {
      const response = await axiosPrivate.patch(`/users/${userId}`, payload);
      if (__DEV__) {
        logger.log('✅ Profile updated successfully');
        logger.log('📥 Response:', JSON.stringify(response.data));
      }
    } catch (error: unknown) {
      logger.error('❌ Profile update failed');
      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }
      throw error;
    }
  },

  /**
   * Update business profile (BusinessScreen data)
   * Server expects: req.body.values.{entrepreneur, companyName, industry, ...}
   */
  async updateBusiness(data: BusinessFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    await axiosPrivate.patch(`/users/business/${userId}`, {
      values: {
        entrepreneur: data.entrepreneur === 'Yes',
        industry: data.industry,
        lengthOpen: data.businessSize,
        factorsOfLocation: data.businessLocationReason,
      },
    });
  },

  /**
   * Update artist profile (ArtScreen data)
   * Server expects: req.body.values.{artist, professional, purpose, ...}
   */
  async updateArt(data: ArtFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    await axiosPrivate.patch(`/users/art/${userId}`, {
      values: {
        artist: data.artist === 'Yes',
        professional: data.professionalArtist === 'Yes',
        purpose: data.purpose,
        favsOrNoneFavs: data.favorites,
        affectIssues: data.issues,
        navigateIndustry: data.industryNavigation,
        network: data.network === 'Yes',
        specificIntegral: data.integral === 'Yes',
      },
    });
  },

  /**
   * Upload profile picture (base64)
   * Server expects: req.body._id and req.body.newImage.image
   */
  async uploadProfilePicture(base64Image: string): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    if (__DEV__) {
      logger.log('🌐 Uploading to server - User ID:', userId);
      logger.log('📊 Image data length:', base64Image.length);
      logger.log('📊 Image data preview:', base64Image.substring(0, 100));
    }

    try {
      const response = await axiosPrivate.post('/users/pic', {
        _id: userId,
        newImage: {
          image: base64Image,
        },
      });

      if (__DEV__) {
        logger.log('✅ Server response status:', response.status);
        logger.log('✅ Server response data:', JSON.stringify(response.data));
      }
    } catch (error: unknown) {
      logger.error('❌ Upload request failed', error);
      throw error;
    }
  },

  /**
   * Get profile picture
   * Server expects: req.body._id
   */
  async getProfilePicture(): Promise<string | null> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const response = await axiosPrivate.post('/users/getpic', {
      _id: userId,
    });

    return response.data?.getImageToClient || null;
  },

  /**
   * Fetch another user's profile by their ID
   * Used for viewing other users' profiles (Phase 2: Social Features)
   *
   * Expected endpoint: GET /users/:userId (Issue #54)
   */
  async fetchProfileById(userId: string): Promise<ServerUserProfile> {
    if (!userId) throw new Error('User ID is required');

    if (__DEV__) {
      logger.log('📥 Fetching profile for user:', userId);
    }

    try {
      const response = await axiosPrivate.get(`/users/${userId}`);

      if (__DEV__) {
        logger.log('✅ Profile fetched for user:', userId);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch profile for user:', userId);

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Update edit profile data (EditProfileScreen data)
   * Server expects: req.body.values.{name, bio, city, state, country, interests, b2bOpportunities}
   */
  async updateEditProfile(data: EditProfileFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const payload = {
      values: {
        name: data.name,
        bio: data.bio,
        city: data.city,
        state: data.state,
        country: data.country,
        interests: data.interests,
        b2bOpportunities: data.b2bOpportunities,
      },
    };

    if (__DEV__) {
      logger.log('💾 Updating edit profile for user:', userId);
      logger.log('📦 Update payload:', JSON.stringify(payload));
    }

    try {
      const response = await axiosPrivate.patch(`/users/${userId}`, payload);
      if (__DEV__) {
        logger.log('✅ Edit profile updated successfully');
        logger.log('📥 Response:', JSON.stringify(response.data));
      }
    } catch (error: unknown) {
      logger.error('❌ Edit profile update failed');
      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }
      throw error;
    }
  },
};
