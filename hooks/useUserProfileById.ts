/**
 * Hook for fetching another user's profile by their ID
 *
 * Used for viewing other users' profiles (Phase 2: Social Features)
 * Follows useUserProfile pattern but fetches an arbitrary user, not just current user.
 */

import { useState, useEffect, useCallback } from 'react';
import { userProfileService } from '@/services/userProfileService';
import { logger } from '@/utils/logger';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';
import type { ServerUserProfile } from '@/types/UserProfile';

interface UseUserProfileByIdResult {
  profile: ServerUserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch another user's profile by their ID
 */
export const useUserProfileById = (userId: string): UseUserProfileByIdResult => {
  const { user, loading: authLoading } = useAuth();
  useAxiosPrivate();
  const [profile, setProfile] = useState<ServerUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!user || !userId) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (__DEV__) {
        logger.log('📥 Fetching profile for user:', userId);
      }
      const profileData = await userProfileService.fetchProfileById(userId);
      if (__DEV__) {
        logger.log('✅ Profile fetched for user:', userId);
      }
      setProfile(profileData);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(fetchError);
      setProfile(null);
      logger.error('❌ Failed to fetch profile for user:', userId, err);
    } finally {
      setLoading(false);
    }
  }, [user, userId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void fetchProfile();
  }, [user, authLoading, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
