import { useContext, useDebugValue } from "react";
import { AuthContext } from "../provider/AuthProvider";

const useAuth = () => {
  return ({ auth, setAuth } = useContext(AuthContext));
};

export default useAuth;
