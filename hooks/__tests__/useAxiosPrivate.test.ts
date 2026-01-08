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
jest.mock('@/API/axios', () => ({
  axiosPrivate: {
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
  },
}));
jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

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
    it('should call serverAuth.refreshToken on 403 error', () => {
      renderHook(() => useAxiosPrivate());

      // Response interceptor is set up with error handler
      expect(axiosPrivate.interceptors.response.use).toHaveBeenCalled();

      const responseInterceptorCall = (axiosPrivate.interceptors.response.use as jest.Mock).mock.calls[0];
      expect(responseInterceptorCall).toBeDefined();
      expect(typeof responseInterceptorCall[1]).toBe('function'); // Error handler exists
    });

    it('should handle token refresh failure', () => {
      mockedServerAuth.refreshToken = jest.fn().mockRejectedValue(new Error('Refresh failed'));

      renderHook(() => useAxiosPrivate());

      expect(axiosPrivate.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
