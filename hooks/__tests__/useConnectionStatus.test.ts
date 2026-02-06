/**
 * Tests for useConnectionStatus hook
 *
 * Manages connection state between current user and a target user (Phase 2: Social Features)
 */

import { renderHook, waitFor, act } from '@testing-library/react-native';
import { connectionService } from '@/services/connectionService';
import useAuth from '../useAuth';
import useAxiosPrivate from '../useAxiosPrivate';
import { useConnectionStatus } from '../useConnectionStatus';
import type { ConnectionStatusResponse } from '@/types/connection';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('../useAxiosPrivate');
jest.mock('@/services/connectionService');
jest.mock('@/utils/logger');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<typeof useAxiosPrivate>;
const mockConnectionService = connectionService as jest.Mocked<typeof connectionService>;

describe('useConnectionStatus', () => {
  const targetUserId = 'user-456-def';

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

    it('fetches connection status on mount', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'none',
      };
      mockConnectionService.getConnectionStatus.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockConnectionService.getConnectionStatus).toHaveBeenCalledWith(targetUserId);
      expect(result.current.status).toBe('none');
      expect(result.current.error).toBeNull();
    });

    it('returns connected status when users are connected', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'connected',
        connectionId: 'conn-1',
      };
      mockConnectionService.getConnectionStatus.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('connected');
      expect(result.current.connectionId).toBe('conn-1');
    });

    it('returns pending_sent status', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'pending_sent',
        connectionId: 'conn-2',
      };
      mockConnectionService.getConnectionStatus.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('pending_sent');
    });

    it('handles fetch errors gracefully', async () => {
      mockConnectionService.getConnectionStatus.mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('none');
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });

    it('does not fetch when targetUserId is empty', async () => {
      const { result } = renderHook(() => useConnectionStatus(''));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockConnectionService.getConnectionStatus).not.toHaveBeenCalled();
      expect(result.current.status).toBe('none');
    });

    it('sends a connection request and refetches status', async () => {
      // Initial status: none
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'none',
      });

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // After sending request: pending_sent
      mockConnectionService.sendConnectionRequest.mockResolvedValue({
        _id: 'conn-new',
        requester: 'user-123',
        recipient: targetUserId,
        status: 'pending',
        createdAt: '2026-02-06T12:00:00.000Z',
        updatedAt: '2026-02-06T12:00:00.000Z',
      });
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'pending_sent',
        connectionId: 'conn-new',
      });

      await act(async () => {
        await result.current.sendRequest();
      });

      expect(mockConnectionService.sendConnectionRequest).toHaveBeenCalledWith(targetUserId);
      expect(mockConnectionService.getConnectionStatus).toHaveBeenCalledTimes(2);
    });

    it('accepts a connection request and refetches status', async () => {
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'pending_received',
        connectionId: 'conn-1',
      });

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockConnectionService.acceptConnectionRequest.mockResolvedValue({
        _id: 'conn-1',
        requester: targetUserId,
        recipient: 'user-123',
        status: 'accepted',
        createdAt: '2026-02-06T12:00:00.000Z',
        updatedAt: '2026-02-06T12:00:00.000Z',
      });
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'connected',
        connectionId: 'conn-1',
      });

      await act(async () => {
        await result.current.acceptRequest('conn-1');
      });

      expect(mockConnectionService.acceptConnectionRequest).toHaveBeenCalledWith('conn-1');
    });

    it('declines a connection request and refetches status', async () => {
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'pending_received',
        connectionId: 'conn-1',
      });

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockConnectionService.declineConnectionRequest.mockResolvedValue(undefined);
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'none',
      });

      await act(async () => {
        await result.current.declineRequest('conn-1');
      });

      expect(mockConnectionService.declineConnectionRequest).toHaveBeenCalledWith('conn-1');
    });

    it('removes a connection and refetches status', async () => {
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'connected',
        connectionId: 'conn-1',
      });

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockConnectionService.removeConnection.mockResolvedValue(undefined);
      mockConnectionService.getConnectionStatus.mockResolvedValueOnce({
        status: 'none',
      });

      await act(async () => {
        await result.current.removeConnection('conn-1');
      });

      expect(mockConnectionService.removeConnection).toHaveBeenCalledWith('conn-1');
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      } as ReturnType<typeof useAuth>);
    });

    it('does not fetch and returns none status', async () => {
      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockConnectionService.getConnectionStatus).not.toHaveBeenCalled();
      expect(result.current.status).toBe('none');
    });
  });

  describe('when auth is still loading', () => {
    it('returns loading state while auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useConnectionStatus(targetUserId));

      expect(result.current.loading).toBe(true);
      expect(mockConnectionService.getConnectionStatus).not.toHaveBeenCalled();
    });
  });
});
