/**
 * Tests for connectionService
 * Following TDD approach - tests written before backend implementation
 *
 * These tests define the expected API contract for when backend is ready.
 * Backend implementation tracked in: GitHub Issues #52, #53
 */

// Mock dependencies BEFORE imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock('@/API/axios', () => ({
  axiosPrivate: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('@/utils/logger');

import { connectionService } from '../connectionService';
import { axiosPrivate } from '@/API/axios';
import type {
  Connection,
  ConnectionStatusResponse,
  ConnectionUser,
} from '@/types/connection';

// Note: connectionService does not use serverAuth directly.
// Authentication is handled by useAxiosPrivate interceptors which add the JWT header.
// The backend extracts the userId from the JWT token.

describe('connectionService', () => {
  const mockTargetUserId = 'user-456-def';
  const mockedAxiosPrivate = axiosPrivate as jest.Mocked<typeof axiosPrivate>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendConnectionRequest', () => {
    it('sends a connection request successfully', async () => {
      const mockConnection: Connection = {
        _id: 'conn-1',
        requester: 'user-123-abc',
        recipient: mockTargetUserId,
        status: 'pending',
        createdAt: '2026-02-06T12:00:00.000Z',
        updatedAt: '2026-02-06T12:00:00.000Z',
      };

      mockedAxiosPrivate.post.mockResolvedValueOnce({ data: mockConnection });

      const result = await connectionService.sendConnectionRequest(mockTargetUserId);

      expect(axiosPrivate.post).toHaveBeenCalledWith('/connections/request', {
        recipientId: mockTargetUserId,
      });
      expect(result).toEqual(mockConnection);
      expect(result.status).toBe('pending');
    });

    it('throws error when target user ID is empty', async () => {
      await expect(connectionService.sendConnectionRequest('')).rejects.toThrow(
        'Target user ID is required'
      );
      expect(axiosPrivate.post).not.toHaveBeenCalled();
    });

    it('handles 409 conflict when connection already exists', async () => {
      const mockError = {
        response: {
          status: 409,
          data: { message: 'Connection request already exists' },
        },
        message: 'Request failed with status code 409',
      };
      mockedAxiosPrivate.post.mockRejectedValueOnce(mockError);

      await expect(
        connectionService.sendConnectionRequest(mockTargetUserId)
      ).rejects.toEqual(mockError);
    });

    it('handles server errors correctly', async () => {
      const mockError = new Error('Server error');
      mockedAxiosPrivate.post.mockRejectedValueOnce(mockError);

      await expect(
        connectionService.sendConnectionRequest(mockTargetUserId)
      ).rejects.toThrow('Server error');
    });
  });

  describe('acceptConnectionRequest', () => {
    it('accepts a pending connection request', async () => {
      const mockConnection: Connection = {
        _id: 'conn-1',
        requester: mockTargetUserId,
        recipient: 'user-123-abc',
        status: 'accepted',
        createdAt: '2026-02-06T12:00:00.000Z',
        updatedAt: '2026-02-06T12:00:00.000Z',
      };

      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: mockConnection });

      const result = await connectionService.acceptConnectionRequest('conn-1');

      expect(axiosPrivate.patch).toHaveBeenCalledWith('/connections/conn-1/accept');
      expect(result).toEqual(mockConnection);
      expect(result.status).toBe('accepted');
    });

    it('throws error when connection ID is empty', async () => {
      await expect(connectionService.acceptConnectionRequest('')).rejects.toThrow(
        'Connection ID is required'
      );
      expect(axiosPrivate.patch).not.toHaveBeenCalled();
    });

    it('handles 404 when connection not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Connection not found' },
        },
        message: 'Request failed with status code 404',
      };
      mockedAxiosPrivate.patch.mockRejectedValueOnce(mockError);

      await expect(
        connectionService.acceptConnectionRequest('invalid-id')
      ).rejects.toEqual(mockError);
    });
  });

  describe('declineConnectionRequest', () => {
    it('declines a pending connection request', async () => {
      mockedAxiosPrivate.patch.mockResolvedValueOnce({ data: {} });

      await connectionService.declineConnectionRequest('conn-1');

      expect(axiosPrivate.patch).toHaveBeenCalledWith('/connections/conn-1/decline');
    });

    it('throws error when connection ID is empty', async () => {
      await expect(connectionService.declineConnectionRequest('')).rejects.toThrow(
        'Connection ID is required'
      );
      expect(axiosPrivate.patch).not.toHaveBeenCalled();
    });

    it('handles server errors correctly', async () => {
      const mockError = new Error('Server error');
      mockedAxiosPrivate.patch.mockRejectedValueOnce(mockError);

      await expect(
        connectionService.declineConnectionRequest('conn-1')
      ).rejects.toThrow('Server error');
    });
  });

  describe('removeConnection', () => {
    it('removes an accepted connection', async () => {
      mockedAxiosPrivate.delete.mockResolvedValueOnce({ data: {} });

      await connectionService.removeConnection('conn-1');

      expect(axiosPrivate.delete).toHaveBeenCalledWith('/connections/conn-1');
    });

    it('throws error when connection ID is empty', async () => {
      await expect(connectionService.removeConnection('')).rejects.toThrow(
        'Connection ID is required'
      );
      expect(axiosPrivate.delete).not.toHaveBeenCalled();
    });

    it('handles 404 when connection not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Connection not found' },
        },
        message: 'Request failed with status code 404',
      };
      mockedAxiosPrivate.delete.mockRejectedValueOnce(mockError);

      await expect(connectionService.removeConnection('invalid-id')).rejects.toEqual(
        mockError
      );
    });
  });

  describe('getConnections', () => {
    it('fetches accepted connections successfully', async () => {
      const mockUsers: ConnectionUser[] = [
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

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockUsers });

      const result = await connectionService.getConnections();

      expect(axiosPrivate.get).toHaveBeenCalledWith('/connections');
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when user has no connections', async () => {
      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: [] });

      const result = await connectionService.getConnections();

      expect(axiosPrivate.get).toHaveBeenCalledWith('/connections');
      expect(result).toEqual([]);
    });

    it('handles server errors correctly', async () => {
      const mockError = new Error('Server error');
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(connectionService.getConnections()).rejects.toThrow('Server error');
    });
  });

  describe('getPendingRequests', () => {
    it('fetches pending connection requests successfully', async () => {
      const mockPending: Connection[] = [
        {
          _id: 'conn-1',
          requester: 'user-7',
          recipient: 'user-123-abc',
          status: 'pending',
          createdAt: '2026-02-06T12:00:00.000Z',
          updatedAt: '2026-02-06T12:00:00.000Z',
        },
      ];

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockPending });

      const result = await connectionService.getPendingRequests();

      expect(axiosPrivate.get).toHaveBeenCalledWith('/connections/pending');
      expect(result).toEqual(mockPending);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('pending');
    });

    it('returns empty array when no pending requests', async () => {
      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: [] });

      const result = await connectionService.getPendingRequests();

      expect(axiosPrivate.get).toHaveBeenCalledWith('/connections/pending');
      expect(result).toEqual([]);
    });

    it('handles server errors correctly', async () => {
      const mockError = new Error('Server error');
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(connectionService.getPendingRequests()).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('getConnectionStatus', () => {
    it('returns "none" when no connection exists', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'none',
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await connectionService.getConnectionStatus(mockTargetUserId);

      expect(axiosPrivate.get).toHaveBeenCalledWith(
        `/connections/status/${mockTargetUserId}`
      );
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('none');
      expect(result.connectionId).toBeUndefined();
    });

    it('returns "pending_sent" when current user sent a request', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'pending_sent',
        connectionId: 'conn-1',
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await connectionService.getConnectionStatus(mockTargetUserId);

      expect(result.status).toBe('pending_sent');
      expect(result.connectionId).toBe('conn-1');
    });

    it('returns "pending_received" when target user sent a request', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'pending_received',
        connectionId: 'conn-2',
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await connectionService.getConnectionStatus(mockTargetUserId);

      expect(result.status).toBe('pending_received');
      expect(result.connectionId).toBe('conn-2');
    });

    it('returns "connected" when users are connected', async () => {
      const mockResponse: ConnectionStatusResponse = {
        status: 'connected',
        connectionId: 'conn-3',
      };

      mockedAxiosPrivate.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await connectionService.getConnectionStatus(mockTargetUserId);

      expect(result.status).toBe('connected');
      expect(result.connectionId).toBe('conn-3');
    });

    it('throws error when target user ID is empty', async () => {
      await expect(connectionService.getConnectionStatus('')).rejects.toThrow(
        'Target user ID is required'
      );
      expect(axiosPrivate.get).not.toHaveBeenCalled();
    });

    it('handles server errors correctly', async () => {
      const mockError = new Error('Server error');
      mockedAxiosPrivate.get.mockRejectedValueOnce(mockError);

      await expect(
        connectionService.getConnectionStatus(mockTargetUserId)
      ).rejects.toThrow('Server error');
    });
  });
});
