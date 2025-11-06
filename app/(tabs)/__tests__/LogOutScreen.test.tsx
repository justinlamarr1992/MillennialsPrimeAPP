import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import LogOutScreen from '../LogOutScreen';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  signOut: jest.fn(),
}));

// expo-router is already mocked in setup.ts
const mockRouter = router as jest.Mocked<typeof router>;

describe('LogOutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render logout screen with message and button', () => {
      render(<LogOutScreen />);

      expect(screen.getByText("Come Back Soon, There's More to Come")).toBeTruthy();
      expect(screen.getByText('Log Out')).toBeTruthy();
    });
  });

  describe('Logout Behavior', () => {
    it('should call signOut when user presses logout button', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith({});
      });
    });

    it('should navigate to SignIn screen after successful logout', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/(auth)/SignInScreen');
      });
    });

    it('should show loading indicator during logout', async () => {
      (signOut as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      // Loading indicator should appear
      await waitFor(() => {
        expect(screen.getByTestId('activity-indicator')).toBeTruthy();
      }, { timeout: 50 });
    });

    it('should not navigate when logout fails', async () => {
      (signOut as jest.Mock).mockRejectedValue({
        code: 'auth/network-request-failed',
        message: 'Network error'
      });

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(screen.getByText('Network error. Please check your internet connection')).toBeTruthy();
      });

      // Should not navigate on error
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when logout fails', async () => {
      (signOut as jest.Mock).mockRejectedValue({
        code: 'auth/network-request-failed',
        message: 'Network error'
      });

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(screen.getByText('Network error. Please check your internet connection')).toBeTruthy();
      });
    });

    it('should show generic error for unknown logout errors', async () => {
      (signOut as jest.Mock).mockRejectedValue({
        code: 'auth/unknown-error',
        message: 'Something went wrong'
      });

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again')).toBeTruthy();
      });
    });

    it('should allow retry after logout error', async () => {
      // First attempt fails
      (signOut as jest.Mock).mockRejectedValueOnce({
        code: 'auth/network-request-failed',
        message: 'Network error'
      });

      render(<LogOutScreen />);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(screen.getByText('Network error. Please check your internet connection')).toBeTruthy();
      });

      // Second attempt succeeds
      (signOut as jest.Mock).mockResolvedValueOnce(undefined);

      fireEvent.press(screen.getByText('Log Out'));

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/(auth)/SignInScreen');
      });
    });
  });
});
