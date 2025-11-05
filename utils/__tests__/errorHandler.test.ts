/**
 * Tests for error handling utilities
 * Target Coverage: 100%
 */

import { FirebaseError } from 'firebase/app';
import { handleAuthError, handleGenericError } from '../errorHandler';
import { logger } from '../logger';

// Mock the logger
jest.mock('../logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    exception: jest.fn(),
  },
}));

describe('errorHandler utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('handleAuthError', () => {
    describe('sign in and password reset errors', () => {
      it('should return user-friendly message for user-not-found', () => {
        const error = new FirebaseError('auth/user-not-found', 'User not found');
        expect(handleAuthError(error)).toBe(
          'No account found with this email address'
        );
      });

      it('should return user-friendly message for wrong-password', () => {
        const error = new FirebaseError('auth/wrong-password', 'Wrong password');
        expect(handleAuthError(error)).toBe(
          'Incorrect password. Please try again'
        );
      });

      it('should return user-friendly message for invalid-credential', () => {
        const error = new FirebaseError(
          'auth/invalid-credential',
          'Invalid credential'
        );
        expect(handleAuthError(error)).toBe('Invalid email or password');
      });

      it('should return user-friendly message for user-disabled', () => {
        const error = new FirebaseError('auth/user-disabled', 'User disabled');
        expect(handleAuthError(error)).toBe(
          'This account has been disabled. Please contact support'
        );
      });

      it('should return user-friendly message for too-many-requests', () => {
        const error = new FirebaseError(
          'auth/too-many-requests',
          'Too many requests'
        );
        expect(handleAuthError(error)).toBe(
          'Too many failed attempts. Please try again later'
        );
      });
    });

    describe('registration errors', () => {
      it('should return user-friendly message for email-already-in-use', () => {
        const error = new FirebaseError(
          'auth/email-already-in-use',
          'Email in use'
        );
        expect(handleAuthError(error)).toBe(
          'An account with this email already exists'
        );
      });

      it('should return user-friendly message for weak-password', () => {
        const error = new FirebaseError('auth/weak-password', 'Weak password');
        expect(handleAuthError(error)).toBe(
          'Password must be at least 6 characters'
        );
      });

      it('should return user-friendly message for invalid-email', () => {
        const error = new FirebaseError('auth/invalid-email', 'Invalid email');
        expect(handleAuthError(error)).toBe('Please enter a valid email address');
      });

      it('should return user-friendly message for operation-not-allowed', () => {
        const error = new FirebaseError(
          'auth/operation-not-allowed',
          'Operation not allowed'
        );
        expect(handleAuthError(error)).toBe(
          'Email/password sign-in is not enabled. Please contact support'
        );
      });
    });

    describe('password reset specific errors', () => {
      it('should return user-friendly message for invalid-action-code', () => {
        const error = new FirebaseError(
          'auth/invalid-action-code',
          'Invalid action code'
        );
        expect(handleAuthError(error)).toBe(
          'This password reset link is invalid or has expired'
        );
      });

      it('should return user-friendly message for expired-action-code', () => {
        const error = new FirebaseError(
          'auth/expired-action-code',
          'Expired action code'
        );
        expect(handleAuthError(error)).toBe(
          'This password reset link has expired. Please request a new one'
        );
      });
    });

    describe('network errors', () => {
      it('should return user-friendly message for network-request-failed', () => {
        const error = new FirebaseError(
          'auth/network-request-failed',
          'Network failed'
        );
        expect(handleAuthError(error)).toBe(
          'Network error. Please check your internet connection'
        );
      });
    });

    describe('token errors', () => {
      it('should return user-friendly message for invalid-user-token', () => {
        const error = new FirebaseError(
          'auth/invalid-user-token',
          'Invalid token'
        );
        expect(handleAuthError(error)).toBe(
          'Your session has expired. Please sign in again'
        );
      });

      it('should return user-friendly message for user-token-expired', () => {
        const error = new FirebaseError(
          'auth/user-token-expired',
          'Token expired'
        );
        expect(handleAuthError(error)).toBe(
          'Your session has expired. Please sign in again'
        );
      });

      it('should return user-friendly message for requires-recent-login', () => {
        const error = new FirebaseError(
          'auth/requires-recent-login',
          'Recent login required'
        );
        expect(handleAuthError(error)).toBe(
          'This operation requires recent authentication. Please sign in again'
        );
      });
    });

    describe('unknown error codes', () => {
      it('should return generic message for unknown error code', () => {
        const error = new FirebaseError(
          'auth/unknown-error-code',
          'Some unknown error'
        );
        expect(handleAuthError(error)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should log unknown error codes for debugging', () => {
        const error = new FirebaseError(
          'auth/unknown-error-code',
          'Some unknown error'
        );
        handleAuthError(error);

        expect(logger.error).toHaveBeenCalledWith(
          'Unhandled Firebase auth error:',
          'auth/unknown-error-code',
          'Some unknown error'
        );
      });

      it('should handle completely unrecognized error codes', () => {
        const error = new FirebaseError(
          'auth/some-new-firebase-error',
          'New error'
        );
        expect(handleAuthError(error)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });
    });

    describe('error logging integration', () => {
      it('should call logger.error for unhandled errors', () => {
        const error = new FirebaseError('auth/unhandled-code', 'Unhandled error');
        handleAuthError(error);

        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledWith(
          'Unhandled Firebase auth error:',
          'auth/unhandled-code',
          'Unhandled error'
        );
      });

      it('should not log known error codes', () => {
        const error = new FirebaseError('auth/user-not-found', 'User not found');
        handleAuthError(error);

        expect(logger.error).not.toHaveBeenCalled();
      });
    });
  });

  describe('handleGenericError', () => {
    describe('Error instances', () => {
      it('should return error message from Error instance', () => {
        const error = new Error('Something went wrong');
        expect(handleGenericError(error)).toBe('Something went wrong');
      });

      it('should return generic message when Error has no message', () => {
        const error = new Error('');
        expect(handleGenericError(error)).toBe('An unexpected error occurred');
      });

      it('should handle TypeError instances', () => {
        const error = new TypeError('Type error occurred');
        expect(handleGenericError(error)).toBe('Type error occurred');
      });

      it('should handle ReferenceError instances', () => {
        const error = new ReferenceError('Reference error occurred');
        expect(handleGenericError(error)).toBe('Reference error occurred');
      });

      it('should handle custom Error subclasses', () => {
        class CustomError extends Error {
          constructor(message: string) {
            super(message);
            this.name = 'CustomError';
          }
        }
        const error = new CustomError('Custom error message');
        expect(handleGenericError(error)).toBe('Custom error message');
      });
    });

    describe('string errors', () => {
      it('should return string error directly', () => {
        expect(handleGenericError('String error message')).toBe(
          'String error message'
        );
      });

      it('should handle empty string', () => {
        expect(handleGenericError('')).toBe('');
      });

      it('should handle multi-line string error', () => {
        const errorMsg = 'Error on line 1\nError on line 2';
        expect(handleGenericError(errorMsg)).toBe(errorMsg);
      });
    });

    describe('unknown error types', () => {
      it('should return generic message for null', () => {
        expect(handleGenericError(null)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should return generic message for undefined', () => {
        expect(handleGenericError(undefined)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should return generic message for number', () => {
        expect(handleGenericError(123)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should return generic message for boolean', () => {
        expect(handleGenericError(false)).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should return generic message for plain object', () => {
        expect(handleGenericError({ error: 'some error' })).toBe(
          'An unexpected error occurred. Please try again'
        );
      });

      it('should return generic message for array', () => {
        expect(handleGenericError(['error1', 'error2'])).toBe(
          'An unexpected error occurred. Please try again'
        );
      });
    });
  });
});
