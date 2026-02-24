import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import IndexScreen from "../index";
import {
  signInWithEmailAndPassword,
  mockAuthInstance,
  mockUser,
} from "@/__tests__/__mocks__/firebase";
import { serverAuth } from "@/services/serverAuth";
import { userProfileService } from "@/services/userProfileService";
import Toast from "react-native-toast-message";

jest.mock("@/services/serverAuth");
jest.mock("@/services/userProfileService");

// expo-router and @react-native-firebase/auth are mocked in setup.ts

const mockLoginToServer = serverAuth.loginToServer as jest.Mock;
const mockSyncPassword = serverAuth.syncPassword as jest.Mock;
const mockFetchProfile = userProfileService.fetchProfile as jest.Mock;
const mockToastShow = Toast.show as jest.Mock;

describe("IndexScreen (login form)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchProfile.mockResolvedValue({ firstName: "Jordan" });
  });

  describe("Email Validation", () => {
    it("shows error for invalid email format in real-time", async () => {
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "invalid-email");

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });
    });

    it("clears email error when valid email is entered", async () => {
      render(<IndexScreen />);

      const emailInput = screen.getByPlaceholderText("Enter Email");

      fireEvent.changeText(emailInput, "invalid");
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      fireEvent.changeText(emailInput, "valid@example.com");
      await waitFor(() => {
        expect(screen.queryByText("Invalid email format")).toBeNull();
      });
    });

    it("does not show email error when field is empty", () => {
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "");

      expect(screen.queryByText("Invalid email format")).toBeNull();
      expect(screen.queryByText("Email is required")).toBeNull();
    });
  });

  describe("Form Validation Behavior", () => {
    it("does not submit with only password filled", () => {
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");
      fireEvent.press(screen.getByText("Login"));

      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("does not submit with only email filled", () => {
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.press(screen.getByText("Login"));

      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("does not submit with invalid email format", async () => {
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "invalid-email");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");

      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Login"));

      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("submits when both email and password are valid", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");

      fireEvent.press(screen.getByText("Login"));

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
    });
  });

  describe("Form Submission", () => {
    it("calls Firebase signInWithEmailAndPassword with the entered credentials", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "ValidPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          "test@example.com",
          "ValidPass123!"
        );
      });
    });

    it("does not call router.replace — navigation is handled by root layout auth listener", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });

      const { router } = require("expo-router");
      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "ValidPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalled();
      });
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  describe("Welcome toast", () => {
    beforeEach(() => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });
      mockLoginToServer.mockResolvedValue(undefined);
    });

    it("shows welcome toast with firstName from profile after successful login", async () => {
      mockFetchProfile.mockResolvedValue({ firstName: "Jordan" });

      render(<IndexScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "ValidPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith({
          type: "success",
          text1: "Welcome back, Jordan!",
        });
      });
    });

    it("falls back to email prefix toast when fetchProfile throws", async () => {
      mockFetchProfile.mockRejectedValue(new Error("Network error"));

      render(<IndexScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "ValidPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith({
          type: "success",
          text1: "Welcome back, test!",
        });
      });
    });
  });

  describe("Error Handling", () => {
    it("shows error when sign in fails with invalid-credential", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid credentials",
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "wrongpassword");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Invalid email or password");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("shows error for network failures", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/network-request-failed",
        message: "Network error",
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Network error. Please check your internet connection");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("shows generic error for unknown Firebase errors", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/unknown-error",
        message: "Something went wrong",
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "password123");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("An unexpected error occurred. Please try again");
        expect(errors[0]).toBeTruthy();
      });
    });

    it("clears error message when user makes changes", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
        code: "auth/invalid-credential",
        message: "Invalid credentials",
      });

      render(<IndexScreen />);

      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "wrongpassword");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText("Invalid email or password");
        expect(errors[0]).toBeTruthy();
      });

      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "newpassword");

      await waitFor(() => {
        expect(screen.queryByText("Invalid email or password")).toBeNull();
      });
    });
  });

  describe("Navigation Links", () => {
    it("has a Sign Up link", () => {
      render(<IndexScreen />);
      expect(screen.getByText("Sign Up")).toBeTruthy();
    });

    it("has a Forgot Password link", () => {
      render(<IndexScreen />);
      expect(screen.getByText("Forgot Password?")).toBeTruthy();
    });
  });

  describe("MongoDB password sync", () => {
    beforeEach(() => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: { uid: "test-uid", email: "test@example.com" },
      });
      mockAuthInstance.currentUser = {
        ...mockUser,
        getIdToken: jest.fn().mockResolvedValue("firebase-id-token-abc"),
      } as unknown as typeof mockUser;
    });

    afterEach(() => {
      mockAuthInstance.currentUser = mockUser;
    });

    it("auto-syncs and retries login when loginToServer returns 401", async () => {
      mockLoginToServer
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce(undefined);
      mockSyncPassword.mockResolvedValue(undefined);

      render(<IndexScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        expect(mockSyncPassword).toHaveBeenCalledWith("firebase-id-token-abc", "NewPass123!");
        expect(mockLoginToServer).toHaveBeenCalledTimes(2);
      });
      expect(screen.queryByText(/password was recently reset/i)).toBeNull();
    });

    it("shows sync error message when syncPassword fails after 401", async () => {
      mockLoginToServer.mockRejectedValueOnce({ response: { status: 401 } });
      mockSyncPassword.mockRejectedValue(new Error("sync failed"));

      render(<IndexScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const errors = screen.getAllByText(/password was recently reset/i);
        expect(errors[0]).toBeTruthy();
      });
    });

    it("shows generic warning for non-401 MongoDB errors", async () => {
      mockLoginToServer.mockRejectedValueOnce({ response: { status: 500 } });

      render(<IndexScreen />);
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

      render(<IndexScreen />);
      fireEvent.changeText(screen.getByPlaceholderText("Enter Email"), "test@example.com");
      fireEvent.changeText(screen.getByPlaceholderText("Enter Password"), "NewPass123!");
      fireEvent.press(screen.getByText("Login").parent!);

      await waitFor(() => {
        const warnings = screen.getAllByText(
          /Password sync completed but server connection failed/i
        );
        expect(warnings[0]).toBeTruthy();
      });
    });
  });
});
