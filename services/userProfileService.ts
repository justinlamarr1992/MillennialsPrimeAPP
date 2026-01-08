/**
 * Service for managing user profile data with the server
 */

import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { serverAuth } from './serverAuth';
import type {
  ServerUserProfile,
  MyInfoFormData,
  BusinessFormData,
  ArtFormData,
} from '@/types/UserProfile';

export const userProfileService = {
  /**
   * Fetch complete user profile from server
   */
  async fetchProfile(): Promise<ServerUserProfile> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    const response = await axiosPrivate.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update basic profile info (MyInfoScreen data)
   */
  async updateMyInfo(data: MyInfoFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    await axiosPrivate.patch(`/users/${userId}`, {
      name: data.name,
      location: {
        country: data.country,
        state: data.state,
        city: data.city,
        zip: parseInt(data.zip) || 0,
      },
    });
  },

  /**
   * Update business profile (BusinessScreen data)
   */
  async updateBusiness(data: BusinessFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    await axiosPrivate.patch(`/users/business/${userId}`, {
      entrepreneur: data.entrepreneur === 'Yes',
      industry: data.industry,
      lengthOpen: data.businessSize,
      factorsOfLocation: data.businessLocationReason,
    });
  },

  /**
   * Update artist profile (ArtScreen data)
   */
  async updateArt(data: ArtFormData): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    await axiosPrivate.patch(`/users/art/${userId}`, {
      artist: data.artist === 'Yes',
      professional: data.professionalArtist === 'Yes',
      purpose: data.purpose,
      favsOrNoneFavs: data.favorites,
      affectIssues: data.issues,
      navigateIndustry: data.industryNavigation,
      network: data.network === 'Yes',
      specificIntegral: data.integral === 'Yes',
    });
  },

  /**
   * Upload profile picture (base64)
   */
  async uploadProfilePicture(base64Image: string): Promise<void> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    await axiosPrivate.post('/users/pic', {
      image: base64Image,
      userID: userId,
    });
  },

  /**
   * Get profile picture
   */
  async getProfilePicture(): Promise<string | null> {
    const userId = await serverAuth.getUserId();
    if (!userId) throw new Error('User ID not found');

    const axiosPrivate = useAxiosPrivate();
    const response = await axiosPrivate.post('/users/getpic', {
      userID: userId,
    });

    return response.data?.image || null;
  },
};
