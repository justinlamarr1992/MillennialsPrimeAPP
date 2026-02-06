/**
 * Service for managing user connections (social features)
 *
 * API Contract (Expected endpoints - to be implemented by backend):
 * - POST /connections/request - Send connection request
 * - PATCH /connections/:id/accept - Accept pending request
 * - PATCH /connections/:id/decline - Decline pending request
 * - DELETE /connections/:id - Remove accepted connection
 * - GET /connections - Get accepted connections
 * - GET /connections/pending - Get incoming pending requests
 * - GET /connections/status/:userId - Check connection status with target user
 *
 * Backend Implementation Status: NOT YET IMPLEMENTED
 * Tracked in: GitHub Issues #52, #53
 *
 * This service defines the API contract for when backend is ready.
 *
 * Note: Unlike userProfileService, this service does not call serverAuth.getUserId().
 * Authentication is handled by useAxiosPrivate interceptors (JWT header injection).
 * The backend extracts the requesting userId from the JWT token.
 */

import { axiosPrivate } from '@/API/axios';
import { logger } from '@/utils/logger';
import type {
  Connection,
  ConnectionStatusResponse,
  ConnectionUser,
} from '@/types/connection';

export const connectionService = {
  /**
   * Send a connection request to another user
   *
   * Expected endpoint: POST /connections/request
   * Expected body: { recipientId }
   * Expected response: Connection object with status 'pending'
   */
  async sendConnectionRequest(targetUserId: string): Promise<Connection> {
    if (!targetUserId) {
      throw new Error('Target user ID is required');
    }

    if (__DEV__) {
      logger.log('📤 Sending connection request to:', targetUserId);
    }

    try {
      const response = await axiosPrivate.post<Connection>('/connections/request', {
        recipientId: targetUserId,
      });

      if (__DEV__) {
        logger.log('✅ Connection request sent successfully');
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to send connection request');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Accept a pending connection request
   *
   * Expected endpoint: PATCH /connections/:id/accept
   * Expected response: Connection object with status 'accepted'
   */
  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    if (!connectionId) {
      throw new Error('Connection ID is required');
    }

    if (__DEV__) {
      logger.log('✅ Accepting connection request:', connectionId);
    }

    try {
      const response = await axiosPrivate.patch<Connection>(
        `/connections/${connectionId}/accept`
      );

      if (__DEV__) {
        logger.log('✅ Connection request accepted');
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to accept connection request');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Decline a pending connection request
   *
   * Expected endpoint: PATCH /connections/:id/decline
   */
  async declineConnectionRequest(connectionId: string): Promise<void> {
    if (!connectionId) {
      throw new Error('Connection ID is required');
    }

    if (__DEV__) {
      logger.log('❌ Declining connection request:', connectionId);
    }

    try {
      await axiosPrivate.patch(`/connections/${connectionId}/decline`);

      if (__DEV__) {
        logger.log('✅ Connection request declined');
      }
    } catch (error: unknown) {
      logger.error('❌ Failed to decline connection request');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Remove an accepted connection
   *
   * Expected endpoint: DELETE /connections/:id
   */
  async removeConnection(connectionId: string): Promise<void> {
    if (!connectionId) {
      throw new Error('Connection ID is required');
    }

    if (__DEV__) {
      logger.log('🗑️ Removing connection:', connectionId);
    }

    try {
      await axiosPrivate.delete(`/connections/${connectionId}`);

      if (__DEV__) {
        logger.log('✅ Connection removed');
      }
    } catch (error: unknown) {
      logger.error('❌ Failed to remove connection');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Get user's accepted connections
   *
   * Expected endpoint: GET /connections
   * Expected response: ConnectionUser[]
   */
  async getConnections(): Promise<ConnectionUser[]> {
    if (__DEV__) {
      logger.log('📥 Fetching connections');
    }

    try {
      const response = await axiosPrivate.get<ConnectionUser[]>('/connections');

      if (__DEV__) {
        logger.log('✅ Connections fetched:', response.data.length);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch connections');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Get incoming pending connection requests
   *
   * Expected endpoint: GET /connections/pending
   * Expected response: Connection[]
   */
  async getPendingRequests(): Promise<Connection[]> {
    if (__DEV__) {
      logger.log('📥 Fetching pending connection requests');
    }

    try {
      const response = await axiosPrivate.get<Connection[]>('/connections/pending');

      if (__DEV__) {
        logger.log('✅ Pending requests fetched:', response.data.length);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to fetch pending requests');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },

  /**
   * Check connection status between current user and target user
   *
   * Expected endpoint: GET /connections/status/:userId
   * Expected response: { status: ConnectionStatus, connectionId?: string }
   */
  async getConnectionStatus(targetUserId: string): Promise<ConnectionStatusResponse> {
    if (!targetUserId) {
      throw new Error('Target user ID is required');
    }

    if (__DEV__) {
      logger.log('🔍 Checking connection status with:', targetUserId);
    }

    try {
      const response = await axiosPrivate.get<ConnectionStatusResponse>(
        `/connections/status/${targetUserId}`
      );

      if (__DEV__) {
        logger.log('✅ Connection status:', response.data.status);
      }

      return response.data;
    } catch (error: unknown) {
      logger.error('❌ Failed to check connection status');

      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown };
          message?: string;
        };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
      }

      throw error;
    }
  },
};
