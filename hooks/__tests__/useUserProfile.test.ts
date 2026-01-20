/**
 * Tests for useUserProfile hook
 * Target Coverage: 90%
 *
 * Behavior-focused tests: We test what the hook does, not how it does it
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserProfile } from '../useUserProfile';
import { userProfileService } from '@/services/userProfileService';
import useAuth from '../useAuth';
import useAxiosPrivate from '../useAxiosPrivate';
import type { ServerUserProfile } from '@/types/UserProfile';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('../useAxiosPrivate');
jest.mock('@/services/userProfileService');
jest.mock('@/utils/logger');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<typeof useAxiosPrivate>;
const mockUserProfileService = userProfileService as jest.Mocked<typeof userProfileService>;

describe('useUserProfile', () => {
  const mockAxiosPrivate = {} as any;
  const mockProfile: ServerUserProfile = {
    _id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    country: 'USA',
    state: 'CA',
    city: 'San Francisco',
    zip: 94102,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxiosPrivate.mockReturnValue(mockAxiosPrivate);
  });

  describe('When no user is logged in', () => {
    it('should return null profile and not be loading', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useUserProfile());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-123', email: 'test@example.com' },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });
    });

    it('should return profile data after loading', async () => {
      mockUserProfileService.fetchProfile.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useUserProfile());

      // Eventually the profile should be loaded
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it('should return error when fetch fails', async () => {
      const fetchError = new Error('Network error');
      mockUserProfileService.fetchProfile.mockRejectedValue(fetchError);

      const { result } = renderHook(() => useUserProfile());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.error).toEqual(fetchError);
    });

    it('should allow refetching the profile', async () => {
      const updatedProfile = { ...mockProfile, name: 'Updated Name' };
      mockUserProfileService.fetchProfile
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(updatedProfile);

      const { result } = renderHook(() => useUserProfile());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.profile?.name).toBe('Test User');
      });

      // Refetch
      await result.current.refetch();

      // Should have updated data
      await waitFor(() => {
        expect(result.current.profile?.name).toBe('Updated Name');
      });
    });

    it('should clear error on successful refetch', async () => {
      // First fetch fails
      mockUserProfileService.fetchProfile.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useUserProfile());

      // Wait for error
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Refetch succeeds
      mockUserProfileService.fetchProfile.mockResolvedValueOnce(mockProfile);
      await result.current.refetch();

      // Error should be cleared and profile loaded
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.profile).toEqual(mockProfile);
      });
    });
  });

  describe('When auth state changes', () => {
    it('should load profile when user logs in', async () => {
      mockUserProfileService.fetchProfile.mockResolvedValue(mockProfile);

      const { result, rerender } = renderHook(
        ({ user }) => {
          mockUseAuth.mockReturnValue({
            user,
            loading: false,
            signIn: jest.fn(),
            signOut: jest.fn(),
            signUp: jest.fn(),
          });
          return useUserProfile();
        },
        {
          initialProps: { user: null as any },
        }
      );

      // Initially no profile
      await waitFor(() => {
        expect(result.current.profile).toBeNull();
      });

      // User logs in
      rerender({ user: { uid: 'user-123', email: 'test@example.com' } });

      // Profile should load
      await waitFor(() => {
        expect(result.current.profile).toEqual(mockProfile);
      });
    });

    it('should clear profile when user logs out', async () => {
      mockUserProfileService.fetchProfile.mockResolvedValue(mockProfile);

      const { result, rerender } = renderHook(
        ({ user }) => {
          mockUseAuth.mockReturnValue({
            user,
            loading: false,
            signIn: jest.fn(),
            signOut: jest.fn(),
            signUp: jest.fn(),
          });
          return useUserProfile();
        },
        {
          initialProps: { user: { uid: 'user-123', email: 'test@example.com' } as any },
        }
      );

      // Wait for profile to load
      await waitFor(() => {
        expect(result.current.profile).toEqual(mockProfile);
      });

      // User logs out
      rerender({ user: null });

      // Profile should be cleared
      await waitFor(() => {
        expect(result.current.profile).toBeNull();
      });
    });
  });
});
