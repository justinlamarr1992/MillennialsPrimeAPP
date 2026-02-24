import React from "react";
import { render, screen, act } from "@testing-library/react-native";
import { RootLayoutNav } from "../_layout";
import useAuth from "@/hooks/useAuth";
import { useSegments, useRouter } from "expo-router";

jest.mock("@/hooks/useAuth");

jest.mock("expo-router", () => {
  const ReactMock = require("react");
  return {
    useSegments: jest.fn(),
    useRouter: jest.fn(),
    Stack: Object.assign(
      ({ children }: { children: React.ReactNode }) =>
        ReactMock.createElement(ReactMock.Fragment, null, children),
      { Screen: () => null }
    ),
  };
});

const mockUseAuth = useAuth as jest.Mock;
const mockUseSegments = useSegments as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe("RootLayoutNav", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
  });

  describe("loading state", () => {
    it("renders loading indicator while auth is loading", () => {
      mockUseAuth.mockReturnValue({ user: null, loading: true });
      mockUseSegments.mockReturnValue([]);

      render(<RootLayoutNav />);

      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  describe("initial route — segments empty", () => {
    it("renders loading indicator for authenticated user when no route is active yet", () => {
      mockUseAuth.mockReturnValue({ user: { uid: "123" }, loading: false });
      mockUseSegments.mockReturnValue([]);

      render(<RootLayoutNav />);

      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });

    it("does not redirect unauthenticated user (stays on index login form)", async () => {
      mockUseAuth.mockReturnValue({ user: null, loading: false });
      mockUseSegments.mockReturnValue([]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("redirects authenticated user to home", async () => {
      mockUseAuth.mockReturnValue({ user: { uid: "123" }, loading: false });
      mockUseSegments.mockReturnValue([]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/(home)/HomePage");
    });
  });

  describe("auth group routing", () => {
    it("redirects authenticated user away from auth group to home", async () => {
      mockUseAuth.mockReturnValue({ user: { uid: "123" }, loading: false });
      mockUseSegments.mockReturnValue(["(auth)"]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/(home)/HomePage");
    });

    it("does not redirect unauthenticated user already on auth screen", async () => {
      mockUseAuth.mockReturnValue({ user: null, loading: false });
      mockUseSegments.mockReturnValue(["(auth)"]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("protected route routing", () => {
    it("redirects unauthenticated user away from protected route to index", async () => {
      mockUseAuth.mockReturnValue({ user: null, loading: false });
      mockUseSegments.mockReturnValue(["(tabs)"]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    it("does not redirect authenticated user on a protected route", async () => {
      mockUseAuth.mockReturnValue({ user: { uid: "123" }, loading: false });
      mockUseSegments.mockReturnValue(["(tabs)"]);

      render(<RootLayoutNav />);

      await act(async () => {});

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
