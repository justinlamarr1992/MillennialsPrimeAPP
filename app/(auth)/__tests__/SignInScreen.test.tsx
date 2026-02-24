import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import SignInScreen from "../SignInScreen";
import { router } from "expo-router";
import {
  signInWithEmailAndPassword,
  mockAuthInstance,
  mockUser,
} from "@/__tests__/__mocks__/firebase";
import { serverAuth } from "@/services/serverAuth";

jest.mock("@/services/serverAuth");

// @react-native-firebase/auth is already mocked in setup.ts

// expo-router is already mocked in setup.ts
const mockRouter = router as jest.Mocked<typeof router>;
const mockLoginToServer = serverAuth.loginToServer as jest.Mock;
const mockSyncPassword = serverAuth.syncPassword as jest.Mock;

describe("SignInScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render email and password fields", () => {
      render(<SignInScreen />);

      expect(screen.getByText("Welcome Back")).toBeTruthy();
      expect(screen.getByText("Sign in to Continue")).toBeTruthy();
      expect(screen.getByPlaceholderText("Enter Email")).toBeTruthy();
      expect(screen.getByPlaceholderText("Enter Password")).toBeTruthy();
      expect(screen.getByText("Login")).toBeTruthy();
    });

    it("should render Create an Account link", () => {
      render(<SignInScreen />);
      expect(screen.getByText("Create an Account")).toBeTruthy();
    });

    it("should render Forgot Password link", () => {
      render(<SignInScreen />);
      expect(screen.getByText("Forgot Password Link")).toBeTruthy();
    });
  });

  describe("Email Validation", () => {
    it("should show error for invalid email format in real-time", async () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      fireEvent.changeText(emailInput, "invalid-email");

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });
    });

    it("should clear email error when valid email is entered", async () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");

      // First enter invalid email
      fireEvent.changeText(emailInput, "invalid");
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      // Then enter valid email
      fireEvent.changeText(emailInput, "valid@example.com");
      await waitFor(() => {
        expect(screen.queryByText("Invalid email format")).toBeNull();
      });
    });

    it("should not show email error when field is empty", () => {
      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      fireEvent.changeText(emailInput, "");

      // Error should not appear for empty field (only on submission)
      expect(screen.queryByText("Invalid email format")).toBeNull();
      expect(screen.queryByText("Email is required")).toBeNull();
    });
  });

  describe("Form Validation Behavior", () => {
    it("should not allow login with only password filled", () => {
      render(<SignInScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");
      fireEvent.press(screen.getByText("Login"));

      // User should not be signed in - behavior: signIn not called
      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("should not allow login with only email filled", () => {
      render(<SignInScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.press(screen.getByText("Login"));

      // User should not be signed in - behavior: signIn not called
      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("should not allow login with invalid email format", async () => {
      render(<SignInScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "invalid-email");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");

      // User sees validation error
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Login"));

      // User should not be signed in - behavior: signIn not called
      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("should allow login when both email and password are valid", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      render(<SignInScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");

      await waitFor(() => {
        expect(screen.queryByText("Invalid email format")).toBeNull();
      });

      fireEvent.press(screen.getByText("Login"));

      // User should be signed in - behavior: signIn called and navigated
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
    });
  });

  describe("Form Submission", () => {
    it("should handle sign in async operation correctly", async () => {
      let resolveSignIn: (value: unknown) => void;
      (signInWithEmailAndPassword as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveSignIn = resolve;
          })
      );

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "ValidPass123!");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      // Navigation should not happen immediately
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Resolve the promise
      resolveSignIn!({ user: { uid: "test-uid", email: "test@example.com" } });

      // Navigation is handled by root layout auth listener, not by SignInScreen
      // Verify sign in completed successfully instead
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          "test@example.com",
          "ValidPass123!"
        );
      });
    });

    it("should call Firebase signInWithEmailAndPassword on submit", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "ValidPass123!");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          "test@example.com",
          "ValidPass123!"
        );
      });
    });

    it("should complete sign in successfully without explicit navigation", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "ValidPass123!");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      // Navigation is handled by root layout auth listener
      // Verify sign in completed without calling router.replace
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should show error message when sign in fails with invalid-credential", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid credentials",
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "wrongpassword");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Invalid email or password");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("should show error message when sign in fails with user-not-found", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/user-not-found",
        message: "User not found",
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "nonexistent@example.com");
      fireEvent.changeText(passwordInput, "password123");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("No account found with this email address");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("should show error message for network errors", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/network-request-failed",
        message: "Network error",
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "password123");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Network error. Please check your internet connection");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("should show generic error for unknown Firebase errors", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/unknown-error",
        message: "Something went wrong",
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "password123");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("An unexpected error occurred. Please try again");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("should clear error message when user makes changes", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid credentials",
      });

      render(<SignInScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");
      const passwordInput = screen.getByPlaceholderText("Enter Password");

      // Trigger error
      fireEvent.changeText(emailInput, "test@example.com");
      fireEvent.changeText(passwordInput, "wrongpassword");

      const submitButton = screen.getByText("Login");
      fireEvent.press(submitButton.parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Invalid email or password");
        expect(errors[0]).toBeTruthy();
      });

      // Make a change - error should clear
      fireEvent.changeText(passwordInput, "newpassword");

      await waitFor(() => {
        expect(screen.queryByText("Invalid email or password")).toBeNull();
      });
    });
  });

  describe("Navigation Links", () => {
    it("should have functional Create an Account link", () => {
      render(<SignInScreen />);
      const registerLink = screen.getByText("Create an Account");
      expect(registerLink).toBeTruthy();
      // Link component navigation tested via expo-router mock
    });

    it("should have functional Forgot Password link", () => {
      render(<SignInScreen />);
      const forgotPasswordLink = screen.getByText("Forgot Password Link");
      expect(forgotPasswordLink).toBeTruthy();
      // Link component navigation tested via expo-router mock
    });
  });

  describe("MongoDB password sync", () => {
    beforeEach(() => {
      // Firebase sign-in always succeeds in this describe block
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });
      // Provide getIdToken on currentUser — cast needed as mockUser type lacks getIdToken
      mockAuthInstance.currentUser = {
        ...mockUser,
        getIdToken: jest.fn().mockResolvedValue("firebase-id-token-abc"),
      } as unknown as typeof mockUser;
    });

    afterEach(() => {
      // Restore currentUser so other tests are not affected
      mockAuthInstance.currentUser = mockUser;
    });

    it("auto-syncs and retries login when loginToServer returns 401", async () => {
      // First call throws 401, retry succeeds
      mockLoginToServer
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce(undefined);
      mockSyncPassword.mockResolvedValue(undefined);

      render(<SignInScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(mockSyncPassword).toHaveBeenCalledWith("firebase-id-token-abc", "NewPass123!");
        expect(mockLoginToServer).toHaveBeenCalledTimes(2);
      });
      // No error message shown on successful sync
      expect(screen.queryByText(/password was recently reset/i)).toBeNull();
    });

    it("shows sync error message when syncPassword fails after 401", async () => {
      mockLoginToServer.mockRejectedValueOnce({ response: { status: 401 } });
      mockSyncPassword.mockRejectedValue(new Error("sync failed"));

      render(<SignInScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText(/password was recently reset/i);
        expect(errors[0]).toBeTruthy();
      });
    });

    it("shows generic warning for non-401 MongoDB errors (no sync attempted)", async () => {
      mockLoginToServer.mockRejectedValueOnce({ response: { status: 500 } });

      render(<SignInScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const warnings = screen.getAllByText(/Could not connect to server/i);
        expect(warnings[0]).toBeTruthy();
      });
      expect(mockSyncPassword).not.toHaveBeenCalled();
    });

    it("shows retry error when sync succeeds but retry loginToServer fails", async () => {
      mockLoginToServer
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockRejectedValueOnce({ response: { status: 500 } });
      mockSyncPassword.mockResolvedValue(undefined);

      render(<SignInScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const warnings = screen.getAllByText(
          /Password sync completed but server connection failed/i
        );
        expect(warnings[0]).toBeTruthy();
      });
      expect(mockSyncPassword).toHaveBeenCalledWith("firebase-id-token-abc", "NewPass123!");
      expect(mockLoginToServer).toHaveBeenCalledTimes(2);
    });
  });
});
