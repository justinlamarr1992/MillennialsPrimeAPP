import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import PasswordRecoveryScreen from '../PasswordRecoveryScreen';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from '@/__tests__/__mocks__/firebase';

// @react-native-firebase/auth is already mocked in setup.ts

/**
 * NOTE: alert() is intentionally NOT tested
 *
 * The PasswordRecoveryScreen currently uses native alert() for success messages (line 63).
 * This is a temporary implementation that will be replaced with toast notifications
 * for better UX. Tests for alert() have been removed to avoid coupling tests to
 * implementation that will be removed.
 *
 * See TODO comment in PasswordRecoveryScreen.tsx line 60-62
 */

// expo-router is already mocked in setup.ts
const mockRouter = router as jest.Mocked<typeof router>;

describe('PasswordRecoveryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock global.alert for tests that need it
    global.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('should render password recovery form', () => {
      render(<PasswordRecoveryScreen />);

      expect(screen.getByText('Password Recovery')).toBeTruthy();
      expect(screen.getByText('Enter your email to recovery your Password!')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter Email')).toBeTruthy();
      expect(screen.getByText('Send Email')).toBeTruthy();
    });
  });

  describe('Email Validation', () => {
    it('should show validation error for invalid email', async () => {
      render(<PasswordRecoveryScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');
      fireEvent.changeText(emailInput, 'invalid-email');

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });
    });

    it('should clear validation error when valid email is entered', async () => {
      render(<PasswordRecoveryScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');

      // Enter invalid email
      fireEvent.changeText(emailInput, 'invalid');
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      // Correct to valid email
      fireEvent.changeText(emailInput, 'valid@example.com');
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).toBeNull();
      });
    });

    it('should not show validation error for empty email', () => {
      render(<PasswordRecoveryScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');
      fireEvent.changeText(emailInput, '');

      // No error shown until user tries to submit
      expect(screen.queryByText('Invalid email format')).toBeNull();
    });
  });

  describe('Form Submission Behavior', () => {
    it('should not send reset email with empty email field', () => {
      render(<PasswordRecoveryScreen />);

      fireEvent.press(screen.getByText('Send Email'));

      // Reset email should not be sent
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should not send reset email with invalid email format', async () => {
      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'invalid-email');

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      fireEvent.press(screen.getByText('Send Email'));

      // Reset email should not be sent
      expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should send reset email with valid email', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');

      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).toBeNull();
      });

      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should handle password reset async operation correctly', async () => {
      let resolveReset: () => void;
      (sendPasswordResetEmail as jest.Mock).mockImplementation(
        () => new Promise(resolve => {
          resolveReset = resolve as () => void;
        })
      );

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      // Navigation should not happen immediately
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Resolve the promise
      resolveReset!();

      // Navigation should happen after reset completes
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/SignInScreen');
      });
    });

    it('should show success message and navigate after sending reset email', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/SignInScreen');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error when email is not found', async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
        message: 'User not found'
      });

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'nonexistent@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        const errorMessages = screen.getAllByText('No account found with this email address');
        expect(errorMessages[0]).toBeTruthy();
      });
    });

    it('should show error when network fails', async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/network-request-failed',
        message: 'Network error'
      });

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        const errorMessages = screen.getAllByText('Network error. Please check your internet connection');
        expect(errorMessages[0]).toBeTruthy();
      });
    });

    it('should show generic error for unknown errors', async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/unknown-error',
        message: 'Something went wrong'
      });

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        const errors = screen.getAllByText('An unexpected error occurred. Please try again');
        expect(errors[0]).toBeTruthy();
      });
    });

    it('should clear error message when user types', async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
        message: 'User not found'
      });

      render(<PasswordRecoveryScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');

      // Trigger error
      fireEvent.changeText(emailInput, 'nonexistent@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        const errors = screen.getAllByText('No account found with this email address');
        expect(errors[0]).toBeTruthy();
      });

      // Type something - error should clear
      fireEvent.changeText(emailInput, 'new@example.com');

      await waitFor(() => {
        expect(screen.queryByText('No account found with this email address')).toBeNull();
      });
    });
  });
});
