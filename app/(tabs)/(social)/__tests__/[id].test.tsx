import React from "react";
import { render, screen, waitFor, fireEvent } from "@/__tests__/test-utils";
import UserProfileScreen from "../[id]";
import { useUserProfileById } from "@/hooks/useUserProfileById";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import type { ServerUserProfile } from "@/types/UserProfile";

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ id: "user-456" })),
}));

// Mock data hooks — isolate from backend
jest.mock("@/hooks/useUserProfileById");
jest.mock("@/hooks/useConnectionStatus");

// Mock ProfileHeader — depends on ProfilePicture image loading
jest.mock("@/components/ProfileHeader", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return jest.fn(
    (props: { user: ServerUserProfile }) =>
      React.createElement(
        View,
        { accessibilityLabel: "Profile header" },
        React.createElement(Text, {}, props.user.name ?? ""),
        React.createElement(
          Text,
          {},
          props.user.username ? `@${props.user.username}` : ""
        )
      )
  );
});

// Mock ProfileTabs — depends on post rendering components
jest.mock("@/components/ProfileTabs", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return jest.fn(() =>
    React.createElement(
      View,
      { accessibilityLabel: "Profile content tabs" },
      React.createElement(Text, {}, "Posts")
    )
  );
});

// Real components rendered: ConnectionButton, InterestSection, B2BOpportunitySection

const mockUseUserProfileById =
  useUserProfileById as jest.MockedFunction<typeof useUserProfileById>;
const mockUseConnectionStatus =
  useConnectionStatus as jest.MockedFunction<typeof useConnectionStatus>;

describe("UserProfileScreen", () => {
  const mockProfile: ServerUserProfile = {
    _id: "user-456",
    username: "janesmith",
    name: "Jane Smith",
    email: "jane@example.com",
    interests: ["Photography", "Music"],
    b2bOpportunities: true,
    b2bOpportunityTags: ["Consulting"],
    business: { industry: "Tech" },
    location: { city: "Austin", state: "TX", country: "USA", zip: 73301 },
  };

  const connectionDefaults: ReturnType<typeof useConnectionStatus> = {
    status: "none",
    connectionId: undefined,
    loading: false,
    error: null,
    sendRequest: jest.fn(),
    acceptRequest: jest.fn(),
    declineRequest: jest.fn(),
    removeConnection: jest.fn(),
  };

  const renderWithProfile = (
    profileOverrides?: Partial<ServerUserProfile>,
    connectionOverrides?: Partial<ReturnType<typeof useConnectionStatus>>
  ) => {
    mockUseUserProfileById.mockReturnValue({
      profile: { ...mockProfile, ...profileOverrides },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockUseConnectionStatus.mockReturnValue({
      ...connectionDefaults,
      ...connectionOverrides,
    });

    return render(<UserProfileScreen />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When a user visits a profile that is loading", () => {
    it("should indicate the profile is being loaded", () => {
      mockUseUserProfileById.mockReturnValue({
        profile: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });
      mockUseConnectionStatus.mockReturnValue(connectionDefaults);

      render(<UserProfileScreen />);

      expect(screen.getByLabelText("Loading profile")).toBeTruthy();
    });
  });

  describe("When a profile cannot be loaded", () => {
    it("should inform the user of the failure", () => {
      mockUseUserProfileById.mockReturnValue({
        profile: null,
        loading: false,
        error: new Error("Network error"),
        refetch: jest.fn(),
      });
      mockUseConnectionStatus.mockReturnValue(connectionDefaults);

      render(<UserProfileScreen />);

      expect(screen.getByText("Failed to load profile")).toBeTruthy();
    });
  });

  describe("When no profile data is available", () => {
    it("should inform the user there is no data", () => {
      mockUseUserProfileById.mockReturnValue({
        profile: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseConnectionStatus.mockReturnValue(connectionDefaults);

      render(<UserProfileScreen />);

      expect(screen.getByText("No profile data available")).toBeTruthy();
    });
  });

  describe("When a user visits another user's profile", () => {
    it("should display the user's name", () => {
      renderWithProfile();

      expect(screen.getByText("Jane Smith")).toBeTruthy();
    });

    it("should display the user's handle", () => {
      renderWithProfile();

      expect(screen.getByText("@janesmith")).toBeTruthy();
    });

    it("should offer to send a connection request", () => {
      renderWithProfile();

      expect(
        screen.getByLabelText("Send connection request")
      ).toBeTruthy();
    });

    it("should display the user's interests", () => {
      renderWithProfile();

      expect(screen.getByLabelText("Interest: Photography")).toBeTruthy();
      expect(screen.getByLabelText("Interest: Music")).toBeTruthy();
    });

    it("should display B2B opportunities", () => {
      renderWithProfile();

      expect(screen.getByText("B2B Opportunities")).toBeTruthy();
      expect(screen.getByText("Tech")).toBeTruthy();
    });

    it("should display the user's content tabs", () => {
      renderWithProfile();

      expect(screen.getByLabelText("Profile content tabs")).toBeTruthy();
    });
  });

  describe("When a user sends a connection request", () => {
    it("should initiate the request", () => {
      const mockSendRequest = jest.fn();
      renderWithProfile({}, { sendRequest: mockSendRequest });

      fireEvent.press(screen.getByLabelText("Send connection request"));

      expect(mockSendRequest).toHaveBeenCalled();
    });
  });

  describe("When the connection status is still loading", () => {
    it("should show a loading state on the connection button", () => {
      renderWithProfile({}, { loading: true });

      expect(
        screen.queryByLabelText("Send connection request")
      ).toBeNull();
    });
  });

  describe("When the user has no interests listed", () => {
    it("should not display an interests section", () => {
      renderWithProfile({ interests: [] });

      expect(screen.queryByLabelText("User interests")).toBeNull();
    });
  });

  describe("When B2B opportunities are disabled", () => {
    it("should not display B2B information", () => {
      renderWithProfile({ b2bOpportunities: false });

      expect(
        screen.queryByLabelText("Business to business opportunities")
      ).toBeNull();
    });
  });

  describe("When the user is already connected", () => {
    it("should show a connected status instead of a connect button", () => {
      renderWithProfile(
        {},
        { status: "connected", connectionId: "conn-123" }
      );

      expect(screen.getByLabelText("Remove connection")).toBeTruthy();
    });
  });

  describe("When a connection request is pending", () => {
    it("should show a pending status", () => {
      renderWithProfile({}, { status: "pending_sent" });

      expect(
        screen.getByLabelText("Connection request pending")
      ).toBeTruthy();
    });
  });
});
