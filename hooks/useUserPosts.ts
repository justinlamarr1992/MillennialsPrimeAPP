/**
 * Hook for managing user posts data from MongoDB
 *
 * This hook:
 * - Fetches current user's posts when user logs in
 * - Provides loading and error states
 * - Allows manual refetch of posts data
 * - Returns empty array when no user is logged in
 *
 * Backend Status: API endpoints not yet implemented (tracked in issue #46)
 * This hook is ready for when backend /posts endpoints are deployed.
 */

import { useState, useEffect, useCallback } from 'react';
import { postsService } from '@/services/postsService';
import { logger } from '@/utils/logger';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';
import type { Post } from '@/types/posts';

interface UseUserPostsResult {
  posts: Post[];
  totalCount: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user posts data
 *
 * @returns Object with posts array, total count, loading state, error state, and refetch function
 */
export const useUserPosts = (): UseUserPostsResult => {
  const { user, loading: authLoading } = useAuth();
  useAxiosPrivate(); // Set up axios interceptors for JWT token
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async (): Promise<void> => {
    if (!user) {
      setPosts([]);
      setTotalCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (__DEV__) {
        logger.log('📥 Fetching user posts from server...');
      }
      const postsData = await postsService.fetchUserPosts();
      if (__DEV__) {
        logger.log('✅ Posts data fetched:', JSON.stringify(postsData));
      }
      setPosts(postsData.posts);
      setTotalCount(postsData.totalCount);
    } catch (err) {
      // Preserve the original error object (includes axios response details)
      const error = err instanceof Error ? err : new Error('Failed to fetch posts');
      setError(error as Error);
      setPosts([]);
      setTotalCount(0);
      logger.error('❌ Failed to fetch user posts:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void fetchPosts();
  }, [user, authLoading, fetchPosts]);

  return {
    posts,
    totalCount,
    loading,
    error,
    refetch: fetchPosts,
  };
};
