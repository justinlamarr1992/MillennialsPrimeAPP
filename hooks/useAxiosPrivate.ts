import { axiosPrivate } from "../API/axios";
import React, { useEffect, useContext } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// TODO: Update this hook to work with Firebase authentication
// Currently uses old auth structure (auth, setAuth) which doesn't exist in current AuthContext
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  // const { auth, setAuth } = useAuth(); // Commented out - not in current AuthContext
  const { user } = useAuth();

  useEffect(() => {
    // TODO: Update to use Firebase user token
    console.log(`From the useAxiosPrivate file this is the USER: ${user?.uid}`);
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        // console.log(config.headers);
        if (!config.headers["Authorization"] && user) {
          // TODO: Get Firebase ID token here
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
