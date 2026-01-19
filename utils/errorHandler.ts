import { logger } from "./logger";

// Firebase error interface that works with both web and native SDKs
interface FirebaseAuthError {
  code: string;
  message: string;
}

/**
 * Centralized error handler for Firebase authentication errors
 * Provides user-friendly error messages for common Firebase auth errors
 * Works with both @react-native-firebase/auth and firebase/auth
 *
 * @param error - Firebase error object
 * @returns User-friendly error message
 */
export const handleAuthError = (error: FirebaseAuthError): string => {
  switch (error.code) {
    // Sign In & Password Reset Errors
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';

    // Registration Errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact support';

    // Password Reset Specific Errors
    case 'auth/invalid-action-code':
      return 'This password reset link is invalid or has expired';
    case 'auth/expired-action-code':
      return 'This password reset link has expired. Please request a new one';

    // Network Errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';

    // Token Errors
    case 'auth/invalid-user-token':
      return 'Your session has expired. Please sign in again';
    case 'auth/user-token-expired':
      return 'Your session has expired. Please sign in again';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again';

    // Default
    default:
      // Log the original error code for debugging
      logger.error('Unhandled Firebase auth error:', error.code, error.message);
      return 'An unexpected error occurred. Please try again';
  }
};

/**
 * Generic error handler for non-Firebase errors
 *
 * @param error - Any error object
 * @returns User-friendly error message
 */
export const handleGenericError = (error: unknown): string => {
  if (error instanceof Error) {
    // Return the error message if it's a standard Error
    return error.message || 'An unexpected error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again';
};
