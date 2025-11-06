import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import RegisterScreen from '../RegisterScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// expo-router is already mocked in setup.ts
const mockRouter = router as jest.Mocked<typeof router>;

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(<RegisterScreen />);

      expect(screen.getByText('Create an Account')).toBeTruthy();
      expect(screen.getByText('Sign Up to Continue')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter First Name')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter Last Name')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter Email')).toBeTruthy();
      expect(screen.getByPlaceholderText('Enter Password')).toBeTruthy();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeTruthy();
      expect(screen.getByPlaceholderText('Birthday')).toBeTruthy();
    });

    it('should render login link', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Login')).toBeTruthy();
    });
  });

  describe('Validation - First Name', () => {
    it('should show error when first name is empty on blur', async () => {
      render(<RegisterScreen />);

      const firstNameInput = screen.getByPlaceholderText('Enter First Name');
      fireEvent.changeText(firstNameInput, '');
      fireEvent(firstNameInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeTruthy();
      });
    });

    it('should clear first name error when user starts typing', async () => {
      render(<RegisterScreen />);

      const firstNameInput = screen.getByPlaceholderText('Enter First Name');

      // Trigger error
      fireEvent(firstNameInput, 'blur');
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeTruthy();
      });

      // Start typing - error should clear
      fireEvent.changeText(firstNameInput, 'John');
      await waitFor(() => {
        expect(screen.queryByText('First name is required')).toBeNull();
      });
    });
  });

  describe('Validation - Last Name', () => {
    it('should show error when last name is empty on blur', async () => {
      render(<RegisterScreen />);

      const lastNameInput = screen.getByPlaceholderText('Enter Last Name');
      fireEvent.changeText(lastNameInput, '');
      fireEvent(lastNameInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeTruthy();
      });
    });

    it('should clear last name error when user starts typing', async () => {
      render(<RegisterScreen />);

      const lastNameInput = screen.getByPlaceholderText('Enter Last Name');

      // Trigger error
      fireEvent(lastNameInput, 'blur');
      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeTruthy();
      });

      // Start typing - error should clear
      fireEvent.changeText(lastNameInput, 'Doe');
      await waitFor(() => {
        expect(screen.queryByText('Last name is required')).toBeNull();
      });
    });
  });

  describe('Validation - Email', () => {
    it('should show error for invalid email format on blur', async () => {
      render(<RegisterScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });
    });

    it('should show error for empty email on blur', async () => {
      render(<RegisterScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');
      fireEvent.changeText(emailInput, '');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
      });
    });

    it('should clear email error when user starts typing', async () => {
      render(<RegisterScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');

      // Trigger error
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent(emailInput, 'blur');
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      // Start typing - error should clear
      fireEvent.changeText(emailInput, 'valid@example.com');
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).toBeNull();
      });
    });

    it('should accept valid email format', async () => {
      render(<RegisterScreen />);

      const emailInput = screen.getByPlaceholderText('Enter Email');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).toBeNull();
        expect(screen.queryByText('Email is required')).toBeNull();
      });
    });
  });

  describe('Validation - Password', () => {
    it('should show error for password too short on blur', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'Short1!');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
      });
    });

    it('should show error for password missing uppercase letter', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'password123!');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one uppercase letter')).toBeTruthy();
      });
    });

    it('should show error for password missing lowercase letter', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'PASSWORD123!');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one lowercase letter')).toBeTruthy();
      });
    });

    it('should show error for password missing number', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'Password!');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one number')).toBeTruthy();
      });
    });

    it('should show error for password missing special character', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one special character')).toBeTruthy();
      });
    });

    it('should accept valid password', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      fireEvent.changeText(passwordInput, 'ValidPass123!');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(screen.queryByText(/Password must/)).toBeNull();
      });
    });
  });

  describe('Validation - Confirm Password', () => {
    it('should show error when passwords do not match', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');

      fireEvent.changeText(passwordInput, 'ValidPass123!');
      fireEvent.changeText(confirmInput, 'DifferentPass123!');
      fireEvent(confirmInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeTruthy();
      });
    });

    it('should clear error when passwords match', async () => {
      render(<RegisterScreen />);

      const passwordInput = screen.getByPlaceholderText('Enter Password');
      const confirmInput = screen.getByPlaceholderText('Confirm Password');

      // Create mismatch
      fireEvent.changeText(passwordInput, 'ValidPass123!');
      fireEvent.changeText(confirmInput, 'DifferentPass123!');
      fireEvent(confirmInput, 'blur');

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeTruthy();
      });

      // Fix to match
      fireEvent.changeText(confirmInput, 'ValidPass123!');
      fireEvent(confirmInput, 'blur');

      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).toBeNull();
      });
    });
  });

  describe('Form Submission Behavior', () => {
    it('should not allow registration with empty form', () => {
      render(<RegisterScreen />);

      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton);

      // User sees validation error message
      expect(screen.getByText('Please fix all errors before submitting')).toBeTruthy();
      // Registration does not proceed
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it('should not allow registration with only some fields filled', async () => {
      render(<RegisterScreen />);

      // Partially fill form
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');

      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton);

      // User should not be registered
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it('should show loading state during registration', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByTestId('activity-indicator')).toBeTruthy();
      }, { timeout: 50 });
    });

    it('should call Firebase createUserWithEmailAndPassword on submit', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: 'test-uid', email: 'john@example.com' }
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'john@example.com',
          'ValidPass123!'
        );
      });
    });

    it('should navigate to SignIn screen on successful registration', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: 'test-uid', email: 'john@example.com' }
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/SignInScreen');
      });
    });

    it('should show alert on successful registration', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: 'test-uid', email: 'john@example.com' }
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('You are registered');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error message when registration fails with email-already-in-use', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/email-already-in-use',
        message: 'Email already in use'
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'existing@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(screen.getByText('An account with this email already exists')).toBeTruthy();
      });
    });

    it('should show error message when registration fails with weak-password', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/weak-password',
        message: 'Password is too weak'
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'weak');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'weak');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeTruthy();
      });
    });

    it('should show generic error for unknown Firebase errors', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: 'auth/unknown-error',
        message: 'Something went wrong'
      });

      render(<RegisterScreen />);

      // Fill in all fields
      fireEvent.changeText(screen.getByPlaceholderText('Enter First Name'), 'John');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Last Name'), 'Doe');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'john@example.com');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'ValidPass123!');
      fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'ValidPass123!');
      fireEvent(screen.getByPlaceholderText('Birthday'), 'changeText', 'Mon Jan 01 1990');

      // Submit form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again')).toBeTruthy();
      });
    });

    it('should clear general error message when user makes changes', async () => {
      render(<RegisterScreen />);

      // Set initial error by trying to submit empty form
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(screen.getByText('Please fix all errors before submitting')).toBeTruthy();
      });

      // Make a change to any field
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'test@example.com');

      // Error message should clear
      await waitFor(() => {
        expect(screen.queryByText('Please fix all errors before submitting')).toBeNull();
      });
    });

    it('should prevent submission when form has validation errors', async () => {
      render(<RegisterScreen />);

      // Fill some fields with invalid data
      fireEvent.changeText(screen.getByPlaceholderText('Enter Email'), 'invalid-email');
      fireEvent.changeText(screen.getByPlaceholderText('Enter Password'), 'weak');

      // Try to submit
      const submitButtons = screen.getAllByText('Create an Account');
      const submitButton = submitButtons[submitButtons.length - 1];
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(screen.getByText('Please fix all errors before submitting')).toBeTruthy();
        expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
      });
    });
  });
});
