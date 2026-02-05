/**
 * Service for managing user posts data with the server
 *
 * API Contract (Expected endpoints - to be implemented by backend):
 * - GET /posts/profile - Get current user's posts
 * - GET /posts/:userId - Get posts by specific user
 * - POST /posts - Create new post
 * - PATCH /posts/:id - Update post
 * - DELETE /posts/:id - Delete post
 *
 * Backend Implementation Status: NOT YET IMPLEMENTED
 * Tracked in: GitHub Issue #46
 *
 * This service defines the API contract for when backend is ready.
 */

import { axiosPrivate } from '@/API/axios';
import { serverAuth } from './serverAuth';
import { logger } from '@/utils/logger';
import type { Post } from '@/types/posts';

/**
 * Response from GET /posts/profile endpoint
 */
export interface UserPostsResponse {
  posts: Post[];
  totalCount: number;
}

export const postsService = {
  /**
   * Fetch current user's posts
   *
   * Expected endpoint: GET /posts/profile
   * Expected response: { posts: Post[], totalCount: number }
   *
   * @returns Promise with user's posts array and total count
   * @throws Error if user is not authenticated or request fails
   */
  async fetchUserPosts(): Promise<UserPostsResponse> {
    const userId = await serverAuth.getUserId();
    if (!userId) {
      throw new Error('User ID not found');
    }

    if (__DEV__) {
      logger.log('📥 Fetching posts for user:', userId);
    }

    try {
      const response = await axiosPrivate.get<UserPostsResponse>('/posts/profile');

      if (__DEV__) {
        logger.log('✅ Posts fetched successfully');
        logger.log('📊 Total posts:', response.data.totalCount);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch user posts');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }

      throw error;
    }
  },

  /**
   * Fetch posts by specific user ID (for viewing other users' profiles)
   *
   * Expected endpoint: GET /posts/:userId
   * Expected response: { posts: Post[], totalCount: number }
   *
   * @param userId - The user ID to fetch posts for
   * @returns Promise with user's posts array and total count
   * @throws Error if request fails
   */
  async fetchPostsByUserId(userId: string): Promise<UserPostsResponse> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (__DEV__) {
      logger.log('📥 Fetching posts for user ID:', userId);
    }

    try {
      const response = await axiosPrivate.get<UserPostsResponse>(`/posts/${userId}`);

      if (__DEV__) {
        logger.log('✅ Posts fetched successfully');
        logger.log('📊 Total posts:', response.data.totalCount);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch posts for user:', userId);

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }

      throw error;
    }
  },
};
