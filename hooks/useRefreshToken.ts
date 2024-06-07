import axios from "../API/axios";
import React, { useContext } from "react";
import useAuth from "./useAuth";
import { AuthContext } from "../context/AuthContext";

const useRefreshToken = () => {
  const { auth } = useAuth();
  // const { setAuth } = useContext(AuthContext);
  console.log(`This is from the RefreshTokem File`);
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    // console.log(
    //   "RESPONSE FROM FIRING useRefreshToken ",
    //   JSON.stringify(response, null, 2)
    // );

    // Original coed
    setAuth((prev) => {
      console.log("Response Prev ", JSON.stringify(prev));
      console.log("Response ", response.data.accessToken);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
        _id: response.data._id,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
