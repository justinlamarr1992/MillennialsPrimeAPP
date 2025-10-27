import { axiosPrivate } from "../API/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// ⚠️ KNOWN LIMITATION - Firebase Authentication Not Yet Implemented
//
// This hook is incomplete and requires Firebase authentication implementation before production use.
// Authorization headers are NOT currently being added to API requests (lines 26-27 commented out).
//
// CONTEXT:
// - The app migrated from a custom JWT auth system to Firebase Authentication
// - The backend API may still expect the old JWT pattern or may need Firebase token validation
// - Implementation blocked pending backend API authentication strategy confirmation
//
// IMPLEMENTATION REQUIREMENTS (when backend is ready):
// 1. Uncomment lines 26-27 to add Firebase ID token to Authorization header
// 2. Update useRefreshToken hook to use Firebase token refresh (user.getIdToken(true))
// 3. Coordinate with backend team on token validation strategy
// 4. Test authentication flow end-to-end
//
// CURRENT IMPACT:
// - UploadBox.tsx video uploads: May succeed if backend doesn't enforce auth, or fail silently
// - Other API calls using this hook: Same authentication bypass behavior
//
// This is documented as a known limitation for MVP/development. Not suitable for production
// without implementing the commented Firebase auth code and backend coordination.
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    console.log(`From the useAxiosPrivate file this is the USER: ${user?.uid}`);
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"] && user) {
          // ⚠️ Firebase ID token NOT being added - see documentation above
          // Uncomment when backend authentication strategy is confirmed:
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
