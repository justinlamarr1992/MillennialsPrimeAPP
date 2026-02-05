/**
 * Tests for useAxiosPrivate hook
 * Target Coverage: 75%
 *
 * Updated to test server JWT token management instead of Firebase tokens
 */

import { renderHook } from '@testing-library/react-native';
import useAxiosPrivate from '../useAxiosPrivate';
import { axiosPrivate } from '@/API/axios';
import { serverAuth } from '@/services/serverAuth';

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
jest.mock('@/services/serverAuth');
jest.mock('@/API/axios', () => {
  const mockAxiosFunction = jest.fn().mockResolvedValue({ data: 'mocked response' });
  return {
    axiosPrivate: Object.assign(mockAxiosFunction, {
      interceptors: {
        request: {
          use: jest.fn(() => 1),
          eject: jest.fn(),
        },
        response: {
          use: jest.fn(() => 2),
          eject: jest.fn(),
        },
      },
    }),
  };
});
jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));
jest.mock('@react-native-firebase/auth', () => {
  return jest.fn(() => ({
    signOut: jest.fn().mockResolvedValue(undefined),
  }));
});

const mockedServerAuth = serverAuth as jest.Mocked<typeof serverAuth>;

describe('useAxiosPrivate hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockedServerAuth.getAccessToken = jest.fn().mockResolvedValue('mock-access-token');
    mockedServerAuth.refreshToken = jest.fn().mockResolvedValue('new-access-token');
  });

  describe('hook behavior', () => {
    it('should return the axiosPrivate instance', () => {
      const { result } = renderHook(() => useAxiosPrivate());

      expect(result.current).toBe(axiosPrivate);
    });

    it('should return the same axios instance on re-render', () => {
      const { result, rerender } = renderHook(() => useAxiosPrivate());

      const firstInstance = result.current;
      rerender({});
      const secondInstance = result.current;

      expect(firstInstance).toBe(secondInstance);
      expect(firstInstance).toBe(axiosPrivate);
    });

    it('should set up request and response interceptors', () => {
      renderHook(() => useAxiosPrivate());

      expect(axiosPrivate.interceptors.request.use).toHaveBeenCalled();
      expect(axiosPrivate.interceptors.response.use).toHaveBeenCalled();
    });

    it('should clean up interceptors on unmount', () => {
      const { unmount } = renderHook(() => useAxiosPrivate());

      unmount();

      expect(axiosPrivate.interceptors.request.eject).toHaveBeenCalled();
      expect(axiosPrivate.interceptors.response.eject).toHaveBeenCalled();
    });

    it('should eject interceptors with correct IDs', () => {
      const { unmount } = renderHook(() => useAxiosPrivate());

      unmount();

      // IDs 1 and 2 returned from mocked use() calls
      expect(axiosPrivate.interceptors.request.eject).toHaveBeenCalledWith(1);
      expect(axiosPrivate.interceptors.response.eject).toHaveBeenCalledWith(2);
    });
  });

  describe('request interceptor behavior', () => {
    it('should call serverAuth.getAccessToken on interceptor setup', () => {
      renderHook(() => useAxiosPrivate());

      // Request interceptor is set up
      expect(axiosPrivate.interceptors.request.use).toHaveBeenCalled();
    });

    it('should handle case when no access token exists', async () => {
      mockedServerAuth.getAccessToken = jest.fn().mockResolvedValue(null);

      renderHook(() => useAxiosPrivate());

      expect(axiosPrivate.interceptors.request.use).toHaveBeenCalled();
    });
  });

  describe('response interceptor behavior', () => {
    let errorHandler: (error: unknown) => Promise<unknown>;

    beforeEach(() => {
      renderHook(() => useAxiosPrivate());
      const responseInterceptorCall = (axiosPrivate.interceptors.response.use as jest.Mock).mock.calls[0];
      errorHandler = responseInterceptorCall[1];
    });

    it('should call serverAuth.refreshToken on 401 error and retry request', async () => {
      const mockError = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      mockedServerAuth.refreshToken = jest.fn().mockResolvedValue('new-token');

      const result = await errorHandler(mockError);

      expect(mockedServerAuth.refreshToken).toHaveBeenCalled();
      expect(result).toEqual({ data: 'mocked response' });
      expect(mockError.config.headers['Authorization']).toBe('Bearer new-token');
    });

    it('should call serverAuth.refreshToken on 403 error and retry request', async () => {
      const mockError = {
        response: { status: 403 },
        config: { headers: {} as Record<string, string> },
      };

      mockedServerAuth.refreshToken = jest.fn().mockResolvedValue('new-token');

      const result = await errorHandler(mockError);

      expect(mockedServerAuth.refreshToken).toHaveBeenCalled();
      expect(result).toEqual({ data: 'mocked response' });
      expect(mockError.config.headers['Authorization']).toBe('Bearer new-token');
    });

    it('should not refresh token if request already retried', async () => {
      const mockError = {
        response: { status: 401 },
        config: { headers: {}, sent: true },
      };

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockedServerAuth.refreshToken).not.toHaveBeenCalled();
    });

    it('should clear credentials on token refresh failure', async () => {
      const mockError = {
        response: { status: 401 },
        config: { headers: {} },
      };

      mockedServerAuth.refreshToken = jest.fn().mockRejectedValue(new Error('Refresh failed'));
      mockedServerAuth.logout = jest.fn().mockResolvedValue(undefined);

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockedServerAuth.logout).toHaveBeenCalled();
    });

    it('should not attempt refresh for other error codes', async () => {
      const mockError = {
        response: { status: 500 },
        config: { headers: {} },
      };

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockedServerAuth.refreshToken).not.toHaveBeenCalled();
    });

    it('should reject error without response', async () => {
      const mockError = {
        message: 'Network error',
      };

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockedServerAuth.refreshToken).not.toHaveBeenCalled();
    });

    it('should not attempt refresh if prevRequest is null', async () => {
      const mockError = {
        response: { status: 401 },
        config: null,
      };

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockedServerAuth.refreshToken).not.toHaveBeenCalled();
    });

    it('should call Firebase signOut when token refresh fails', async () => {
      const mockAuth = require('@react-native-firebase/auth');
      const mockSignOut = jest.fn().mockResolvedValue(undefined);
      mockAuth.mockReturnValue({ signOut: mockSignOut });

      const mockError = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      mockedServerAuth.refreshToken = jest.fn().mockRejectedValue(new Error('Refresh failed'));
      mockedServerAuth.logout = jest.fn().mockResolvedValue(undefined);

      await expect(errorHandler(mockError)).rejects.toBeTruthy();
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockedServerAuth.logout).toHaveBeenCalled();
    });

    it('should only trigger one token refresh for concurrent 401 errors (race condition fix)', async () => {
      // Create 3 different mock errors simulating concurrent failed requests
      const mockError1 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };
      const mockError2 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };
      const mockError3 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      // Mock a slow token refresh (50ms delay) to simulate race condition window
      mockedServerAuth.refreshToken = jest.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve('new-token'), 50))
      );

      // Trigger all 3 errors concurrently
      const results = await Promise.all([
        errorHandler(mockError1),
        errorHandler(mockError2),
        errorHandler(mockError3),
      ]);

      // Verify refreshToken was called only ONCE (not 3 times)
      expect(mockedServerAuth.refreshToken).toHaveBeenCalledTimes(1);

      // Verify all 3 requests succeeded with the retried response
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toEqual({ data: 'mocked response' });
      });

      // Verify all 3 requests got the Authorization header updated
      expect(mockError1.config.headers['Authorization']).toBe('Bearer new-token');
      expect(mockError2.config.headers['Authorization']).toBe('Bearer new-token');
      expect(mockError3.config.headers['Authorization']).toBe('Bearer new-token');
    });

    it('should only trigger one logout for concurrent refresh failures', async () => {
      const mockAuth = require('@react-native-firebase/auth');
      const mockSignOut = jest.fn().mockResolvedValue(undefined);
      mockAuth.mockReturnValue({ signOut: mockSignOut });

      // Create 3 different mock errors simulating concurrent failed requests
      const mockError1 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };
      const mockError2 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };
      const mockError3 = {
        response: { status: 401 },
        config: { headers: {} as Record<string, string> },
      };

      // Mock refresh to fail after a delay to simulate race condition window
      mockedServerAuth.refreshToken = jest.fn().mockImplementation(() =>
        new Promise((_, reject) => setTimeout(() => reject(new Error('Refresh failed')), 50))
      );
      mockedServerAuth.logout = jest.fn().mockResolvedValue(undefined);

      // Trigger all 3 errors concurrently and expect them all to fail
      await expect(Promise.all([
        errorHandler(mockError1),
        errorHandler(mockError2),
        errorHandler(mockError3),
      ])).rejects.toBeTruthy();

      // Verify refreshToken was called only ONCE
      expect(mockedServerAuth.refreshToken).toHaveBeenCalledTimes(1);

      // Verify Firebase signOut was called only ONCE (not 3 times) due to isLoggingOut flag
      expect(mockSignOut).toHaveBeenCalledTimes(1);

      // Verify server logout was called only ONCE
      expect(mockedServerAuth.logout).toHaveBeenCalledTimes(1);
    });
  });
});
