import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { axiosPrivate } from '../API/axios';
import { serverAuth } from '@/services/serverAuth';
import { logger } from '@/utils/logger';

// Module-level shared state across all hook instances
// This ensures multiple components using this hook share the same refresh/logout state
let refreshPromise: Promise<string> | null = null;
let isLoggingOut = false;
let activeInterceptors = 0; // Track number of active interceptors for proper cleanup

const useAxiosPrivate = () => {
  useEffect(() => {
    activeInterceptors++;

    if (__DEV__) {
      logger.log(`useAxiosPrivate: Setting up interceptors for server auth (active: ${activeInterceptors})`);
    }

    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        // Get server access token from AsyncStorage
        const accessToken = await serverAuth.getAccessToken();

        if (__DEV__) {
          logger.log('🔑 Request interceptor - Token check:', {
            hasToken: !!accessToken,
            tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
            url: config.url,
            method: config.method,
            hasExistingAuth: !!config.headers['Authorization']
          });
        }

        if (accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          if (__DEV__) {
            logger.log('✅ Added Authorization header to request');
          }
        } else if (!accessToken) {
          logger.warn('⚠️ No JWT token found in AsyncStorage for authenticated request');
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // If 401 (Unauthorized) or 403 (Forbidden) - token expired/invalid
        // and we haven't retried yet
        // Don't try to refresh if the failing request IS the refresh endpoint itself
        if (prevRequest && prevRequest.url !== '/refresh' && (error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest.sent) {
          prevRequest.sent = true;

          if (__DEV__) {
            logger.log(`🔄 Attempting token refresh after ${error?.response?.status} error`);
          }

          try {
            // If refresh is already in progress, wait for it instead of creating a new one
            // This prevents race conditions when multiple requests fail simultaneously
            if (!refreshPromise) {
              if (__DEV__) {
                logger.log('🔐 Starting new token refresh operation');
              }
              refreshPromise = serverAuth.refreshToken()
                .finally(() => {
                  refreshPromise = null; // Clear the promise when done (success or failure)
                });
            } else if (__DEV__) {
              logger.log('⏳ Waiting for existing token refresh operation');
            }

            const newAccessToken = await refreshPromise;
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            if (__DEV__) {
              logger.log('✅ Token refreshed successfully, retrying request');
            }

            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            logger.error('❌ Token refresh failed:', refreshError);
            // Clear invalid credentials and sign out completely
            // Use flag to prevent duplicate logout when multiple requests fail
            if (!isLoggingOut) {
              isLoggingOut = true;
              try {
                await auth().signOut(); // Sign out from Firebase
                await serverAuth.logout(); // Clear server credentials
                // Note: Navigation to login screen is handled automatically by
                // Firebase auth state listener in app/_layout.tsx (lines 42-44)
              } catch (logoutError) {
                logger.error('Failed to clear credentials:', logoutError);
              } finally {
                isLoggingOut = false; // Reset flag after logout completes
              }
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);

      activeInterceptors--;

      // Reset module-level state when last interceptor is removed
      // This prevents stale state when all components using this hook unmount
      if (activeInterceptors === 0) {
        refreshPromise = null;
        isLoggingOut = false;

        if (__DEV__) {
          logger.log('useAxiosPrivate: Last interceptor removed, reset module state');
        }
      }
    };
  }, []); // Empty dependency array - set up once on mount

  return axiosPrivate;
};

// Test-only function to reset module-level state between test runs
// This prevents test pollution from concurrent tests affecting each other
export const __resetModuleState = () => {
  refreshPromise = null;
  isLoggingOut = false;
  activeInterceptors = 0;
};

export default useAxiosPrivate;
