import { auth } from "../firebase/firebaseConfig";
import { logger } from "@/utils/logger";

/**
 * Hook to refresh the Firebase auth token
 * Note: Firebase handles token refresh automatically, but this hook
 * can be used to manually force a token refresh if needed
 */
const useRefreshToken = () => {
  const refresh = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    try {
      // Force refresh the ID token
      const token = await currentUser.getIdToken(true);
      return token;
    } catch (error) {
      // Logger automatically only logs in development
      logger.error("Error refreshing token:", error);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
