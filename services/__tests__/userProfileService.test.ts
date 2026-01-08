/**
 * Tests for userProfileService
 * Following TDD approach - tests written first
 */

// Mock dependencies BEFORE imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock('@/hooks/useAxiosPrivate');
jest.mock('@/services/serverAuth');
jest.mock('@/utils/logger');

import { userProfileService } from '../userProfileService';
import { serverAuth } from '../serverAuth';
import type { ServerUserProfile, MyInfoFormData, BusinessFormData, ArtFormData } from '@/types/UserProfile';

// Mock axios instance that will be returned by useAxiosPrivate
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

// Mock useAxiosPrivate to return our mock axios instance
jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: jest.fn(() => mockAxiosInstance),
}));

const mockedServerAuth = serverAuth as jest.Mocked<typeof serverAuth>;

describe('userProfileService', () => {
  const mockUserId = 'user-123-abc';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedServerAuth.getUserId = jest.fn().mockResolvedValue(mockUserId);
  });

  describe('fetchProfile', () => {
    it('fetches complete user profile from server', async () => {
      const mockProfile: ServerUserProfile = {
        _id: mockUserId,
        username: 'testuser',
        name: 'John Doe',
        email: 'john@example.com',
        location: {
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
          zip: 94102,
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockProfile });

      const result = await userProfileService.fetchProfile();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/users/${mockUserId}`);
      expect(result).toEqual(mockProfile);
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      await expect(userProfileService.fetchProfile()).rejects.toThrow('User ID not found');
    });

    it('handles server errors', async () => {
      const mockError = new Error('Server error');
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(userProfileService.fetchProfile()).rejects.toThrow('Server error');
    });
  });

  describe('updateMyInfo', () => {
    it('updates basic profile info successfully', async () => {
      const formData: MyInfoFormData = {
        name: 'Jane Doe',
        country: 'USA',
        state: 'New York',
        city: 'New York City',
        zip: '10001',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        name: 'Jane Doe',
        location: {
          country: 'USA',
          state: 'New York',
          city: 'New York City',
          zip: 10001,
        },
      });
    });

    it('converts zip string to number', async () => {
      const formData: MyInfoFormData = {
        name: 'Test User',
        country: 'USA',
        state: 'CA',
        city: 'LA',
        zip: '90210',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        name: 'Test User',
        location: {
          country: 'USA',
          state: 'CA',
          city: 'LA',
          zip: 90210,
        },
      });
    });

    it('handles invalid zip code gracefully', async () => {
      const formData: MyInfoFormData = {
        name: 'Test User',
        country: 'USA',
        state: 'CA',
        city: 'LA',
        zip: 'invalid',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateMyInfo(formData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, {
        name: 'Test User',
        location: {
          country: 'USA',
          state: 'CA',
          city: 'LA',
          zip: 0,
        },
      });
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      const formData: MyInfoFormData = {
        name: 'Test',
        country: 'USA',
        state: 'CA',
        city: 'LA',
        zip: '90210',
      };

      await expect(userProfileService.updateMyInfo(formData)).rejects.toThrow('User ID not found');
    });
  });

  describe('updateBusiness', () => {
    it('updates business profile successfully', async () => {
      const formData: BusinessFormData = {
        entrepreneur: 'Yes',
        industry: 'Technology',
        businessSize: 'Medium',
        businessLocationReason: 'Access to talent',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateBusiness(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/business/${mockUserId}`, {
        entrepreneur: true,
        industry: 'Technology',
        lengthOpen: 'Medium',
        factorsOfLocation: 'Access to talent',
      });
    });

    it('converts "No" to false for entrepreneur field', async () => {
      const formData: BusinessFormData = {
        entrepreneur: 'No',
        industry: 'Retail',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateBusiness(formData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/business/${mockUserId}`, {
        entrepreneur: false,
        industry: 'Retail',
        lengthOpen: undefined,
        factorsOfLocation: undefined,
      });
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      const formData: BusinessFormData = {
        entrepreneur: 'Yes',
      };

      await expect(userProfileService.updateBusiness(formData)).rejects.toThrow('User ID not found');
    });
  });

  describe('updateArt', () => {
    it('updates artist profile successfully', async () => {
      const formData: ArtFormData = {
        artist: 'Yes',
        professionalArtist: 'Yes',
        purpose: 'Expression',
        favorites: 'Abstract',
        issues: 'Climate change',
        industryNavigation: 'Networking',
        network: 'Yes',
        integral: 'Yes',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateArt(formData);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/art/${mockUserId}`, {
        artist: true,
        professional: true,
        purpose: 'Expression',
        favsOrNoneFavs: 'Abstract',
        affectIssues: 'Climate change',
        navigateIndustry: 'Networking',
        network: true,
        specificIntegral: true,
      });
    });

    it('converts "No" values to false', async () => {
      const formData: ArtFormData = {
        artist: 'No',
        professionalArtist: 'No',
        network: 'No',
        integral: 'No',
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({ data: {} });

      await userProfileService.updateArt(formData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/users/art/${mockUserId}`, {
        artist: false,
        professional: false,
        purpose: undefined,
        favsOrNoneFavs: undefined,
        affectIssues: undefined,
        navigateIndustry: undefined,
        network: false,
        specificIntegral: false,
      });
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      const formData: ArtFormData = {
        artist: 'Yes',
      };

      await expect(userProfileService.updateArt(formData)).rejects.toThrow('User ID not found');
    });
  });

  describe('uploadProfilePicture', () => {
    it('uploads profile picture successfully', async () => {
      const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });

      await userProfileService.uploadProfilePicture(base64Image);

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/pic', {
        image: base64Image,
        userID: mockUserId,
      });
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      await expect(userProfileService.uploadProfilePicture('base64-image')).rejects.toThrow('User ID not found');
    });
  });

  describe('getProfilePicture', () => {
    it('retrieves profile picture successfully', async () => {
      const mockImage = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { image: mockImage } });

      const result = await userProfileService.getProfilePicture();

      expect(serverAuth.getUserId).toHaveBeenCalled();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/getpic', {
        userID: mockUserId,
      });
      expect(result).toBe(mockImage);
    });

    it('returns null when no image exists', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });

      const result = await userProfileService.getProfilePicture();

      expect(result).toBeNull();
    });

    it('returns null when image is null', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { image: null } });

      const result = await userProfileService.getProfilePicture();

      expect(result).toBeNull();
    });

    it('throws error when user ID not found', async () => {
      mockedServerAuth.getUserId = jest.fn().mockResolvedValue(null);

      await expect(userProfileService.getProfilePicture()).rejects.toThrow('User ID not found');
    });
  });
});
