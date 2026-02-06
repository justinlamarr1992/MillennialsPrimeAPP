/**
 * Tests for useUserProfileById hook
 *
 * Fetches another user's profile by their ID (Phase 2: Social Features)
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { userProfileService } from '@/services/userProfileService';
import useAuth from '../useAuth';
import useAxiosPrivate from '../useAxiosPrivate';
import { useUserProfileById } from '../useUserProfileById';
import type { ServerUserProfile } from '@/types/UserProfile';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('../useAxiosPrivate');
jest.mock('@/services/userProfileService');
jest.mock('@/utils/logger');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<typeof useAxiosPrivate>;
const mockUserProfileService = userProfileService as jest.Mocked<typeof userProfileService>;

describe('useUserProfileById', () => {
  const targetUserId = 'user-456-def';
  const mockProfile: ServerUserProfile = {
    _id: targetUserId,
    username: 'janedoe',
    name: 'Jane Doe',
    email: 'jane@example.com',
    prime: true,
    roles: { User: 2001 },
    interests: ['Tech', 'Music'],
    b2bOpportunities: true,
    b2bOpportunityTags: ['Consulting'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxiosPrivate.mockReturnValue({} as ReturnType<typeof useAxiosPrivate>);
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'user-123', email: 'test@example.com' },
        loading: false,
      } as ReturnType<typeof useAuth>);
    });

    it('fetches profile for the given user ID', async () => {
      mockUserProfileService.fetchProfileById.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useUserProfileById(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockUserProfileService.fetchProfileById).toHaveBeenCalledWith(targetUserId);
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it('handles fetch errors gracefully', async () => {
      mockUserProfileService.fetchProfileById.mockRejectedValue(
        new Error('User not found')
      );

      const { result } = renderHook(() => useUserProfileById(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('User not found');
    });

    it('does not fetch when userId is empty', async () => {
      const { result } = renderHook(() => useUserProfileById(''));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockUserProfileService.fetchProfileById).not.toHaveBeenCalled();
      expect(result.current.profile).toBeNull();
    });

    it('provides a refetch function', async () => {
      mockUserProfileService.fetchProfileById.mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useUserProfileById(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      } as ReturnType<typeof useAuth>);
    });

    it('does not fetch and returns null profile', async () => {
      const { result } = renderHook(() => useUserProfileById(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockUserProfileService.fetchProfileById).not.toHaveBeenCalled();
      expect(result.current.profile).toBeNull();
    });
  });

  describe('when auth is still loading', () => {
    it('returns loading state while auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useUserProfileById(targetUserId));

      expect(result.current.loading).toBe(true);
      expect(mockUserProfileService.fetchProfileById).not.toHaveBeenCalled();
    });
  });
});
