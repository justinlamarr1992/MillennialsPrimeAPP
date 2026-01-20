import { axiosPrivate } from '../API/axios';
import { useEffect } from 'react';
import { serverAuth } from '@/services/serverAuth';
import { logger } from '@/utils/logger';

const useAxiosPrivate = () => {
  useEffect(() => {
    logger.log('useAxiosPrivate: Setting up interceptors for server auth');

    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        // Get server access token from AsyncStorage
        const accessToken = await serverAuth.getAccessToken();

        logger.log('🔑 Request interceptor - Token check:', {
          hasToken: !!accessToken,
          tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
          url: config.url,
          method: config.method,
          hasExistingAuth: !!config.headers['Authorization']
        });

        if (accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          logger.log('✅ Added Authorization header to request');
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

        // If 403 (Forbidden - token expired) and haven't retried yet
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            // Attempt token refresh
            const newAccessToken = await serverAuth.refreshToken();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            logger.error('Token refresh failed:', refreshError);
            // Could trigger logout here
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
