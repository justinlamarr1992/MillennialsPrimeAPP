/**
 * Tests for useRefreshToken hook
 * Target Coverage: 80%
 */

import { renderHook, act } from '@testing-library/react-native';
import useRefreshToken from '../useRefreshToken';
import { auth } from '@/firebase/firebaseConfig';
import { logger } from '@/utils/logger';

// Mock Firebase auth as callable (auth().currentUser pattern)
jest.mock('@/firebase/firebaseConfig', () => ({
  auth: jest.fn(),
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

const mockAuth = auth as unknown as jest.Mock;

describe('useRefreshToken hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockReturnValue({ currentUser: null });
  });

  describe('successful token refresh', () => {
    it('should return a refresh function', () => {
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockResolvedValue('new-token-123'),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      expect(typeof result.current).toBe('function');
    });

    it('should refresh token when called', async () => {
      const mockGetIdToken = jest.fn().mockResolvedValue('fresh-token-456');
      const mockUser = {
        uid: 'test-123',
        getIdToken: mockGetIdToken,
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      let token;
      await act(async () => {
        token = await result.current();
      });

      expect(mockGetIdToken).toHaveBeenCalledWith(true); // force refresh = true
      expect(token).toBe('fresh-token-456');
    });

    it('should call getIdToken with force refresh flag', async () => {
      const mockGetIdToken = jest.fn().mockResolvedValue('token-789');
      const mockUser = {
        uid: 'test-user',
        email: 'test@example.com',
        getIdToken: mockGetIdToken,
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      await act(async () => {
        await result.current();
      });

      // Verify force refresh parameter is true
      expect(mockGetIdToken).toHaveBeenCalledTimes(1);
      expect(mockGetIdToken).toHaveBeenCalledWith(true);
    });

    it('should return the new token', async () => {
      const expectedToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockResolvedValue(expectedToken),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      let actualToken;
      await act(async () => {
        actualToken = await result.current();
      });

      expect(actualToken).toBe(expectedToken);
    });
  });

  describe('error handling', () => {
    it('should throw error when no user is authenticated', async () => {
      mockAuth.mockReturnValue({ currentUser: null });

      const { result } = renderHook(() => useRefreshToken());

      await expect(async () => {
        await act(async () => {
          await result.current();
        });
      }).rejects.toThrow('No authenticated user found');
    });

    it('should log and rethrow error when token refresh fails', async () => {
      const mockError = new Error('Token refresh failed');
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockRejectedValue(mockError),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      await expect(async () => {
        await act(async () => {
          await result.current();
        });
      }).rejects.toThrow('Token refresh failed');

      expect(logger.error).toHaveBeenCalledWith('Error refreshing token:', mockError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockRejectedValue(networkError),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      await expect(async () => {
        await act(async () => {
          await result.current();
        });
      }).rejects.toThrow('Network request failed');

      expect(logger.error).toHaveBeenCalledWith('Error refreshing token:', networkError);
    });

    it('should handle Firebase auth errors', async () => {
      const authError = new Error('auth/user-token-expired');
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockRejectedValue(authError),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      await expect(async () => {
        await act(async () => {
          await result.current();
        });
      }).rejects.toThrow('auth/user-token-expired');
    });
  });

  describe('multiple refresh calls', () => {
    it('should handle multiple sequential refresh calls', async () => {
      const mockGetIdToken = jest.fn()
        .mockResolvedValueOnce('token-1')
        .mockResolvedValueOnce('token-2')
        .mockResolvedValueOnce('token-3');

      const mockUser = {
        uid: 'test-123',
        getIdToken: mockGetIdToken,
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      let token1, token2, token3;
      await act(async () => {
        token1 = await result.current();
        token2 = await result.current();
        token3 = await result.current();
      });

      expect(token1).toBe('token-1');
      expect(token2).toBe('token-2');
      expect(token3).toBe('token-3');
      expect(mockGetIdToken).toHaveBeenCalledTimes(3);
    });

    it('should call getIdToken with force refresh each time', async () => {
      const mockGetIdToken = jest.fn()
        .mockResolvedValue('token');

      const mockUser = {
        uid: 'test-123',
        getIdToken: mockGetIdToken,
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      await act(async () => {
        await result.current();
        await result.current();
      });

      expect(mockGetIdToken).toHaveBeenCalledTimes(2);
      expect(mockGetIdToken).toHaveBeenNthCalledWith(1, true);
      expect(mockGetIdToken).toHaveBeenNthCalledWith(2, true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string token', async () => {
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockResolvedValue(''),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      let token;
      await act(async () => {
        token = await result.current();
      });

      expect(token).toBe('');
    });

    it('should handle user becoming null after hook initialization', async () => {
      const mockUser = {
        uid: 'test-123',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      // User signs out
      mockAuth.mockReturnValue({ currentUser: null });

      await expect(async () => {
        await act(async () => {
          await result.current();
        });
      }).rejects.toThrow('No authenticated user found');
    });

    it('should handle delayed token resolution', async () => {
      const mockGetIdToken = jest.fn(() =>
        new Promise((resolve) => setTimeout(() => resolve('delayed-token'), 100))
      );

      const mockUser = {
        uid: 'test-123',
        getIdToken: mockGetIdToken,
      };
      mockAuth.mockReturnValue({ currentUser: mockUser });

      const { result } = renderHook(() => useRefreshToken());

      let token;
      await act(async () => {
        token = await result.current();
      });

      expect(token).toBe('delayed-token');
      expect(mockGetIdToken).toHaveBeenCalledWith(true);
    });
  });

});
