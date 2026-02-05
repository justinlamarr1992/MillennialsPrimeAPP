import { axiosPrivate } from '../API/axios';
import { useEffect } from 'react';
import { serverAuth } from '@/services/serverAuth';
import { logger } from '@/utils/logger';
import auth from '@react-native-firebase/auth';

const useAxiosPrivate = () => {
  useEffect(() => {
    if (__DEV__) {
      logger.log('useAxiosPrivate: Setting up interceptors for server auth');
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
        if (prevRequest && (error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest.sent) {
          prevRequest.sent = true;

          if (__DEV__) {
            logger.log(`🔄 Attempting token refresh after ${error?.response?.status} error`);
          }

          try {
            // Attempt token refresh
            const newAccessToken = await serverAuth.refreshToken();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            if (__DEV__) {
              logger.log('✅ Token refreshed successfully, retrying request');
            }

            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            logger.error('❌ Token refresh failed:', refreshError);
            // Clear invalid credentials and sign out completely
            try {
              await auth().signOut(); // Sign out from Firebase
              await serverAuth.logout(); // Clear server credentials
            } catch (logoutError) {
              logger.error('Failed to clear credentials:', logoutError);
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
    };
  }, []); // Empty dependency array - set up once on mount

  return axiosPrivate;
};

export default useAxiosPrivate;
