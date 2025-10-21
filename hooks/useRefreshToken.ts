import { auth } from "../firebase/firebaseConfig";

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
      // TODO: Replace with proper error tracking service (e.g., Sentry)
      // Avoid logging sensitive auth information in production
      if (__DEV__) {
        console.error("Error refreshing token:", error);
      }
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
