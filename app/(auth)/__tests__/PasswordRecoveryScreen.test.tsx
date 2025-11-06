import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import PasswordRecoveryScreen from '../PasswordRecoveryScreen';
import { sendPasswordResetEmail } from 'firebase/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// expo-router is already mocked in setup.ts
const mockRouter = router as jest.Mocked<typeof router>;

describe('PasswordRecoveryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
      });
    });

    it('should show loading indicator while sending reset email', async () => {
      (sendPasswordResetEmail as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      // Loading indicator should appear
      await waitFor(() => {
        expect(screen.getByTestId('activity-indicator')).toBeTruthy();
      }, { timeout: 50 });
    });

    it('should show success message and navigate after sending reset email', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      render(<PasswordRecoveryScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');
      fireEvent.press(screen.getByText('Send Email'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Password reset email sent! Check your inbox.');
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
        expect(screen.getByText('No account found with this email address')).toBeTruthy();
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
        expect(screen.getByText('Network error. Please check your internet connection')).toBeTruthy();
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
        expect(screen.getByText('An unexpected error occurred. Please try again')).toBeTruthy();
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
        expect(screen.getByText('No account found with this email address')).toBeTruthy();
      });

      // Type something - error should clear
      fireEvent.changeText(emailInput, 'new@example.com');

      await waitFor(() => {
        expect(screen.queryByText('No account found with this email address')).toBeNull();
      });
    });
  });
});
