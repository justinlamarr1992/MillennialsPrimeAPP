import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import ConnectedUsersScreen from "../ConnectedUsersScreen";
import { useConnections } from "@/hooks/useConnections";
import { createMockConnectionUsers } from "@/__tests__/factories/mockDataFactory";
import type { ConnectionUser } from "@/types/connection";

// Mock data hook — isolate from backend
jest.mock("@/hooks/useConnections");

// Mock expo-router for navigation
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { router: mockRouter } = require("expo-router") as {
  router: { push: jest.MockedFunction<(href: string) => void> };
};

const mockUseConnections =
  useConnections as jest.MockedFunction<typeof useConnections>;

const connectionDefaults: ReturnType<typeof useConnections> = {
  connections: [],
  pendingRequests: [],
  loading: false,
  error: null,
  refetch: jest.fn(),
};

describe("ConnectedUsersScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When the connections are loading", () => {
    it("should indicate the list is being loaded", () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        loading: true,
      });

      render(<ConnectedUsersScreen />);

      expect(screen.getByLabelText("Loading connections")).toBeTruthy();
    });
  });

  describe("When connections fail to load", () => {
    it("should inform the user of the failure", () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        error: new Error("Network error"),
      });

      render(<ConnectedUsersScreen />);

      expect(screen.getByText("Failed to load connections")).toBeTruthy();
    });
  });

  describe("When the user has no connections", () => {
    it("should display an empty state message", () => {
      mockUseConnections.mockReturnValue(connectionDefaults);

      render(<ConnectedUsersScreen />);

      expect(screen.getByText("No connections yet")).toBeTruthy();
    });
  });

  describe("When the user has connections", () => {
    const mockUsers: ConnectionUser[] = createMockConnectionUsers(2);

    const renderWithConnections = (
      users: ConnectionUser[] = mockUsers,
      overrides?: Partial<ReturnType<typeof useConnections>>
    ) => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: users,
        ...overrides,
      });
      return render(<ConnectedUsersScreen />);
    };

    it("should display each connection's name", () => {
      renderWithConnections();

      expect(screen.getByText("User 1")).toBeTruthy();
      expect(screen.getByText("User 2")).toBeTruthy();
    });

    it("should display each connection's username", () => {
      renderWithConnections();

      expect(screen.getByText("@user1")).toBeTruthy();
      expect(screen.getByText("@user2")).toBeTruthy();
    });

    it("should display each connection's industry", () => {
      renderWithConnections();

      expect(screen.getAllByText("Graphic Design")).toHaveLength(2);
    });

    it("should navigate to a user's profile when tapped", () => {
      renderWithConnections();

      fireEvent.press(screen.getByLabelText("View User 1's profile"));

      expect(mockRouter.push).toHaveBeenCalledWith("/(tabs)/(social)/conn-user-1");
    });
  });

  describe("When the user has pending connection requests", () => {
    it("should display the pending request count", () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(1),
        pendingRequests: [
          {
            _id: "req-1",
            requester: "other-user",
            recipient: "me",
            status: "pending",
            createdAt: "2026-02-01T00:00:00Z",
            updatedAt: "2026-02-01T00:00:00Z",
          },
          {
            _id: "req-2",
            requester: "another-user",
            recipient: "me",
            status: "pending",
            createdAt: "2026-02-01T00:00:00Z",
            updatedAt: "2026-02-01T00:00:00Z",
          },
        ],
      });

      render(<ConnectedUsersScreen />);

      expect(screen.getByText("2 pending requests")).toBeTruthy();
    });

    it("should use singular form for a single pending request", () => {
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(1),
        pendingRequests: [
          {
            _id: "req-1",
            requester: "other-user",
            recipient: "me",
            status: "pending",
            createdAt: "2026-02-01T00:00:00Z",
            updatedAt: "2026-02-01T00:00:00Z",
          },
        ],
      });

      render(<ConnectedUsersScreen />);

      expect(screen.getByText("1 pending request")).toBeTruthy();
    });
  });

  describe("When the user pulls to refresh", () => {
    it("should trigger a data refresh", () => {
      const mockRefetch = jest.fn();
      mockUseConnections.mockReturnValue({
        ...connectionDefaults,
        connections: createMockConnectionUsers(1),
        refetch: mockRefetch,
      });

      render(<ConnectedUsersScreen />);

      const list = screen.getByLabelText("Connections list");
      fireEvent(list, "refresh");

      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
