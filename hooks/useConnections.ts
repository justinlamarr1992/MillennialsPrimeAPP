/**
 * Hook for fetching user's connections and pending requests
 *
 * Returns accepted connections and incoming pending requests
 * for the connection system (Phase 2: Social Features).
 */

import { useState, useEffect, useCallback } from 'react';
import { connectionService } from '@/services/connectionService';
import { logger } from '@/utils/logger';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';
import type { Connection, ConnectionUser } from '@/types/connection';

interface UseConnectionsResult {
  connections: ConnectionUser[];
  pendingRequests: Connection[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useConnections = (): UseConnectionsResult => {
  const { user, loading: authLoading } = useAuth();
  useAxiosPrivate();
  const [connections, setConnections] = useState<ConnectionUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!user) {
      setConnections([]);
      setPendingRequests([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [connectionsData, pendingData] = await Promise.all([
        connectionService.getConnections(),
        connectionService.getPendingRequests(),
      ]);

      setConnections(connectionsData);
      setPendingRequests(pendingData);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch connections');
      setError(fetchError);
      setConnections([]);
      setPendingRequests([]);
      logger.error('❌ Failed to fetch connections:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    void fetchData();
  }, [user, authLoading, fetchData]);

  return {
    connections,
    pendingRequests,
    loading,
    error,
    refetch: fetchData,
  };
};
