import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import SocialFeedScreen from "../index";

// Mock expo-router for navigation
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { router: mockRouter } = require("expo-router") as {
  router: { push: jest.MockedFunction<(href: string) => void> };
};

describe("SocialFeedScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When the user views the social feed", () => {
    it("should display the screen title", () => {
      render(<SocialFeedScreen />);

      expect(screen.getByText("Social")).toBeTruthy();
    });

    it("should indicate the feed is coming soon", () => {
      render(<SocialFeedScreen />);

      expect(screen.getByText("Coming Soon")).toBeTruthy();
    });
  });

  describe("When the user navigates to their profile", () => {
    it("should offer a link to My Profile", () => {
      render(<SocialFeedScreen />);

      expect(screen.getByLabelText("Go to My Profile")).toBeTruthy();
    });

    it("should navigate to MyProfileScreen when tapped", () => {
      render(<SocialFeedScreen />);

      fireEvent.press(screen.getByLabelText("Go to My Profile"));

      expect(mockRouter.push).toHaveBeenCalledWith(
        "/(tabs)/(social)/MyProfileScreen"
      );
    });
  });

  describe("When the user navigates to connections", () => {
    it("should offer a link to Connections", () => {
      render(<SocialFeedScreen />);

      expect(screen.getByLabelText("Go to Connections")).toBeTruthy();
    });

    it("should navigate to ConnectedUsersScreen when tapped", () => {
      render(<SocialFeedScreen />);

      fireEvent.press(screen.getByLabelText("Go to Connections"));

      expect(mockRouter.push).toHaveBeenCalledWith(
        "/(tabs)/(social)/ConnectedUsersScreen"
      );
    });
  });
});
