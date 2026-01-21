/**
 * Hook for managing user profile data from MongoDB
 *
 * This hook:
 * - Fetches user profile data when user logs in
 * - Provides loading and error states
 * - Allows manual refetch of profile data
 */

import { useState, useEffect, useCallback } from 'react';
import { userProfileService } from '@/services/userProfileService';
import { logger } from '@/utils/logger';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';
import type { ServerUserProfile } from '@/types/UserProfile';

interface UseUserProfileResult {
  profile: ServerUserProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user profile data
 */
export const useUserProfile = (): UseUserProfileResult => {
  const { user, loading: authLoading } = useAuth();
  useAxiosPrivate(); // Set up axios interceptors for JWT token
  const [profile, setProfile] = useState<ServerUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      logger.log('📥 Fetching user profile from server...');
      const profileData = await userProfileService.fetchProfile();
      logger.log('✅ Profile data fetched:', JSON.stringify(profileData));
      setProfile(profileData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(error);
      setProfile(null);
      logger.error('❌ Failed to fetch user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
