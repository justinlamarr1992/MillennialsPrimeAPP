/**
 * Hook for managing connection status between current user and a target user
 *
 * Provides status checking and action functions (send, accept, decline, remove)
 * for the connection system (Phase 2: Social Features).
 */

import { useState, useEffect, useCallback } from 'react';
import { connectionService } from '@/services/connectionService';
import { logger } from '@/utils/logger';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';
import type { ConnectionStatus } from '@/types/connection';

interface UseConnectionStatusResult {
  status: ConnectionStatus;
  connectionId: string | undefined;
  loading: boolean;
  error: Error | null;
  sendRequest: () => Promise<void>;
  acceptRequest: (connectionId: string) => Promise<void>;
  declineRequest: (connectionId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
}

export const useConnectionStatus = (targetUserId: string): UseConnectionStatusResult => {
  const { user, loading: authLoading } = useAuth();
  useAxiosPrivate();
  const [status, setStatus] = useState<ConnectionStatus>('none');
  const [connectionId, setConnectionId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = useCallback(async (): Promise<void> => {
    if (!user || !targetUserId) {
      setStatus('none');
      setConnectionId(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await connectionService.getConnectionStatus(targetUserId);
      setStatus(response.status);
      setConnectionId(response.connectionId);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch connection status');
      setError(fetchError);
      setStatus('none');
      setConnectionId(undefined);
      logger.error('❌ Failed to fetch connection status:', err);
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void fetchStatus();
  }, [user, authLoading, fetchStatus]);

  const sendRequest = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await connectionService.sendConnectionRequest(targetUserId);
      await fetchStatus();
    } catch (err) {
      const actionError = err instanceof Error ? err : new Error('Failed to send connection request');
      setError(actionError);
      logger.error('❌ Failed to send connection request:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, fetchStatus]);

  const acceptRequest = useCallback(async (connId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await connectionService.acceptConnectionRequest(connId);
      await fetchStatus();
    } catch (err) {
      const actionError = err instanceof Error ? err : new Error('Failed to accept connection request');
      setError(actionError);
      logger.error('❌ Failed to accept connection request:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const declineRequest = useCallback(async (connId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await connectionService.declineConnectionRequest(connId);
      await fetchStatus();
    } catch (err) {
      const actionError = err instanceof Error ? err : new Error('Failed to decline connection request');
      setError(actionError);
      logger.error('❌ Failed to decline connection request:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  const removeConnectionAction = useCallback(async (connId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await connectionService.removeConnection(connId);
      await fetchStatus();
    } catch (err) {
      const actionError = err instanceof Error ? err : new Error('Failed to remove connection');
      setError(actionError);
      logger.error('❌ Failed to remove connection:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  return {
    status,
    connectionId,
    loading,
    error,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeConnection: removeConnectionAction,
  };
};
