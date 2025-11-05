/**
 * Tests for useAxiosPrivate hook
 * Target Coverage: 75%
 *
 * Note: This hook sets up axios interceptors. We test that the hook returns
 * the axios instance and properly cleans up on unmount. Implementation details
 * of how interceptors work are not tested as they are axios library behavior.
 */

import { renderHook } from '@testing-library/react-native';
import useAxiosPrivate from '../useAxiosPrivate';
import useRefreshToken from '../useRefreshToken';
import useAuth from '../useAuth';
import { axiosPrivate } from '@/API/axios';

// Mock dependencies
jest.mock('../useRefreshToken');
jest.mock('../useAuth');
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

const mockedUseRefreshToken = useRefreshToken as jest.MockedFunction<typeof useRefreshToken>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useAxiosPrivate hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockRefresh = jest.fn();
    const mockUser = {
      uid: 'test-123',
      email: 'test@example.com',
      getIdToken: jest.fn().mockResolvedValue('test-token'),
    };

    mockedUseRefreshToken.mockReturnValue(mockRefresh);
    mockedUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    });
  });

  describe('hook behavior', () => {
    it('should return the axiosPrivate instance', () => {
      const { result } = renderHook(() => useAxiosPrivate());

      expect(result.current).toBe(axiosPrivate);
    });

    it('should return the same axios instance on re-render', () => {
      const { result, rerender } = renderHook(() => useAxiosPrivate());

      const firstInstance = result.current;
      rerender();
      const secondInstance = result.current;

      expect(firstInstance).toBe(secondInstance);
      expect(firstInstance).toBe(axiosPrivate);
    });

    it('should clean up interceptors on unmount', () => {
      const { unmount } = renderHook(() => useAxiosPrivate());

      unmount();

      expect(axiosPrivate.interceptors.request.eject).toHaveBeenCalled();
      expect(axiosPrivate.interceptors.response.eject).toHaveBeenCalled();
    });

    it('should re-initialize when user changes', () => {
      const { rerender } = renderHook(() => useAxiosPrivate());

      const initialEjectCalls = (axiosPrivate.interceptors.request.eject as jest.Mock).mock.calls.length;

      // Change user
      mockedUseAuth.mockReturnValue({
        user: {
          uid: 'new-user-456',
          email: 'new@example.com',
          getIdToken: jest.fn().mockResolvedValue('new-token'),
        },
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      rerender();

      // Should have called eject (cleanup happened)
      expect((axiosPrivate.interceptors.request.eject as jest.Mock).mock.calls.length).toBeGreaterThan(
        initialEjectCalls
      );
    });

    it('should work when user is null', () => {
      mockedUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useAxiosPrivate());

      expect(result.current).toBe(axiosPrivate);
    });

    it('should work when user is loading', () => {
      mockedUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      });

      const { result } = renderHook(() => useAxiosPrivate());

      expect(result.current).toBe(axiosPrivate);
    });
  });
});
