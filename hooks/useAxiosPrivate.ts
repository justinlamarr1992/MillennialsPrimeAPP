import { axiosPrivate } from "../API/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// TODO: CRITICAL - This hook is incomplete and API requests will fail authentication
// The hook currently returns an axios instance WITHOUT authorization headers
//
// Migration required from old auth pattern to Firebase:
// 1. Uncomment lines 21-22 to add Firebase ID token to Authorization header
// 2. Update useRefreshToken hook to use Firebase token refresh instead of old JWT pattern
// 3. Test with backend to ensure Firebase tokens are accepted
//
// Current impact: UploadBox.tsx uses this hook for video uploads - uploads may fail auth checks
// See: https://github.com/justinlamarr1992/MillennialsPrimeAPP/issues - needs tracking issue
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    console.log(`From the useAxiosPrivate file this is the USER: ${user?.uid}`);
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"] && user) {
          // TODO: CRITICAL - Uncomment and test Firebase ID token authorization
          // const token = await user.getIdToken();
          // config.headers["Authorization"] = `Bearer ${token}`;
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
  }, [user, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
