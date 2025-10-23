import { axiosPrivate } from "../API/axios";
import React, { useEffect, useContext } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  // TODO: This hook needs to be updated to work with Firebase AuthContext
  // The current AuthContext only has { user, loading } but this expects { auth, setAuth }
  const auth = useAuth();

  useEffect(() => {
    console.log(`From the useAxiosPrivate file this is the AUTH: ${auth}`);
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // console.log(config.headers);
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
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
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
