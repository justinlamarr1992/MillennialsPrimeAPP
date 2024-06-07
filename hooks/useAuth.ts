import { useContext, useDebugValue } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  return ({ auth, setAuth } = useContext(AuthContext));
};

export default useAuth;
