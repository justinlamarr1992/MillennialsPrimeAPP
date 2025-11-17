import { axiosPrivate } from "../API/axios";
import { useEffect, useRef } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { logger } from "@/utils/logger";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();

  // Token caching to prevent race conditions with multiple simultaneous requests
  const tokenCacheRef = useRef<{ token: string | null; promise: Promise<string> | null }>({
    token: null,
    promise: null,
  });

  useEffect(() => {
    logger.log('useAxiosPrivate initialized for user:', user?.uid || 'anonymous');

    // Reset token cache when user changes
    tokenCacheRef.current = { token: null, promise: null };

    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"] && user) {
          try {
            // Use cached token if available, otherwise fetch new token
            // If a token fetch is in progress, reuse the same promise to avoid race conditions
            if (!tokenCacheRef.current.token && !tokenCacheRef.current.promise) {
              tokenCacheRef.current.promise = user.getIdToken();
              tokenCacheRef.current.token = await tokenCacheRef.current.promise;
              tokenCacheRef.current.promise = null;
            } else if (tokenCacheRef.current.promise) {
              // Wait for in-flight token request
              tokenCacheRef.current.token = await tokenCacheRef.current.promise;
              tokenCacheRef.current.promise = null;
            }

            config.headers["Authorization"] = `Bearer ${tokenCacheRef.current.token}`;
          } catch (err) {
            logger.error('Failed to get Firebase ID token for user:', user?.uid || 'anonymous', err);
            // Clear failed token cache
            tokenCacheRef.current = { token: null, promise: null };
            return Promise.reject(err);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]); // axiosPrivate is a stable singleton import, no need to add to deps

  return axiosPrivate;
};

export default useAxiosPrivate;
