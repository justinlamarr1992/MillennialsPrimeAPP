/**
 * Tests for useConnections hook
 *
 * Fetches and manages user's connections and pending requests (Phase 2: Social Features)
 */

import { renderHook, waitFor, act } from '@testing-library/react-native';
import { connectionService } from '@/services/connectionService';
import useAuth from '../useAuth';
import useAxiosPrivate from '../useAxiosPrivate';
import { useConnections } from '../useConnections';
import type { Connection, ConnectionUser } from '@/types/connection';

// Mock dependencies
jest.mock('../useAuth');
jest.mock('../useAxiosPrivate');
jest.mock('@/services/connectionService');
jest.mock('@/utils/logger');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<typeof useAxiosPrivate>;
const mockConnectionService = connectionService as jest.Mocked<typeof connectionService>;

describe('useConnections', () => {
  const mockConnections: ConnectionUser[] = [
    {
      _id: 'user-2',
      name: 'Jane Doe',
      username: 'janedoe',
      profilePic: 'base64pic',
      prime: true,
      roles: { User: 2001 },
      business: { industry: 'Tech' },
    },
    {
      _id: 'user-3',
      name: 'Bob Smith',
      username: 'bobsmith',
      profilePic: '',
      prime: false,
      roles: { User: 2001 },
    },
  ];

  const mockPendingRequests: Connection[] = [
    {
      _id: 'conn-1',
      requester: 'user-7',
      recipient: 'user-123-abc',
      status: 'pending',
      createdAt: '2026-02-06T12:00:00.000Z',
      updatedAt: '2026-02-06T12:00:00.000Z',
    },
  ];

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

    it('fetches connections and pending requests on mount', async () => {
      mockConnectionService.getConnections.mockResolvedValue(mockConnections);
      mockConnectionService.getPendingRequests.mockResolvedValue(mockPendingRequests);

      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockConnectionService.getConnections).toHaveBeenCalled();
      expect(mockConnectionService.getPendingRequests).toHaveBeenCalled();
      expect(result.current.connections).toEqual(mockConnections);
      expect(result.current.pendingRequests).toEqual(mockPendingRequests);
      expect(result.current.error).toBeNull();
    });

    it('returns empty arrays when user has no connections', async () => {
      mockConnectionService.getConnections.mockResolvedValue([]);
      mockConnectionService.getPendingRequests.mockResolvedValue([]);

      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.connections).toEqual([]);
      expect(result.current.pendingRequests).toEqual([]);
    });

    it('handles fetch errors gracefully', async () => {
      mockConnectionService.getConnections.mockRejectedValue(
        new Error('Network error')
      );
      mockConnectionService.getPendingRequests.mockResolvedValue([]);

      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.connections).toEqual([]);
      expect(result.current.pendingRequests).toEqual([]);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });

    it('handles pending requests fetch error gracefully', async () => {
      mockConnectionService.getConnections.mockResolvedValue(mockConnections);
      mockConnectionService.getPendingRequests.mockRejectedValue(
        new Error('Pending fetch failed')
      );

      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.connections).toEqual([]);
      expect(result.current.pendingRequests).toEqual([]);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('provides a refetch function', async () => {
      mockConnectionService.getConnections.mockResolvedValue(mockConnections);
      mockConnectionService.getPendingRequests.mockResolvedValue(mockPendingRequests);

      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');

      // Call refetch
      mockConnectionService.getConnections.mockResolvedValue([]);
      mockConnectionService.getPendingRequests.mockResolvedValue([]);

      await act(async () => {
        await result.current.refetch();
      });

      expect(mockConnectionService.getConnections).toHaveBeenCalledTimes(2);
      expect(mockConnectionService.getPendingRequests).toHaveBeenCalledTimes(2);
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      } as ReturnType<typeof useAuth>);
    });

    it('does not fetch and returns empty arrays', async () => {
      const { result } = renderHook(() => useConnections());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockConnectionService.getConnections).not.toHaveBeenCalled();
      expect(mockConnectionService.getPendingRequests).not.toHaveBeenCalled();
      expect(result.current.connections).toEqual([]);
      expect(result.current.pendingRequests).toEqual([]);
    });
  });

  describe('when auth is still loading', () => {
    it('returns loading state while auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      } as ReturnType<typeof useAuth>);

      const { result } = renderHook(() => useConnections());

      expect(result.current.loading).toBe(true);
      expect(mockConnectionService.getConnections).not.toHaveBeenCalled();
      expect(mockConnectionService.getPendingRequests).not.toHaveBeenCalled();
    });
  });
});
