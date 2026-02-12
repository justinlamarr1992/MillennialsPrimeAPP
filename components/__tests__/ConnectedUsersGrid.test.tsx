import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import ConnectedUsersGrid from "../ConnectedUsersGrid";
import {
  createMockConnectionUser,
  createMockConnectionUsers,
} from "@/__tests__/factories/mockDataFactory";

describe("ConnectedUsersGrid", () => {
  const mockOnUserPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When a user has no connections", () => {
    it("should not display the connections section", () => {
      const { toJSON } = render(
        <ConnectedUsersGrid users={[]} onUserPress={mockOnUserPress} />
      );

      expect(toJSON()).toBeNull();
    });
  });

  describe("When a user views their connections", () => {
    const users = createMockConnectionUsers(3);
    const renderConnections = () =>
      render(
        <ConnectedUsersGrid users={users} onUserPress={mockOnUserPress} />
      );

    it("should display each connected user by name", () => {
      renderConnections();

      users.forEach((user) => {
        expect(screen.getByText(user.name)).toBeTruthy();
      });
    });

    it("should navigate to a connection's profile when pressed", () => {
      renderConnections();

      fireEvent.press(screen.getByLabelText(`View ${users[0].name}'s profile`));

      expect(mockOnUserPress).toHaveBeenCalledWith(users[0]._id);
    });

    it("should allow navigating to any connection's profile", () => {
      renderConnections();

      fireEvent.press(screen.getByLabelText(`View ${users[2].name}'s profile`));

      expect(mockOnUserPress).toHaveBeenCalledWith(users[2]._id);
    });
  });

  describe("When there are more connections than can be displayed", () => {
    const users = createMockConnectionUsers(8);

    it("should show how many additional connections exist", () => {
      render(
        <ConnectedUsersGrid
          users={users}
          onUserPress={mockOnUserPress}
          maxDisplay={5}
        />
      );

      expect(screen.getByText("+3")).toBeTruthy();
    });

    it("should only show connections up to the display limit", () => {
      render(
        <ConnectedUsersGrid
          users={users}
          onUserPress={mockOnUserPress}
          maxDisplay={5}
        />
      );

      for (let i = 0; i < 5; i++) {
        expect(screen.getByText(users[i].name)).toBeTruthy();
      }
      expect(screen.queryByText(users[5].name)).toBeNull();
    });

    it("should default to showing 6 connections before overflow", () => {
      render(
        <ConnectedUsersGrid users={users} onUserPress={mockOnUserPress} />
      );

      for (let i = 0; i < 6; i++) {
        expect(screen.getByText(users[i].name)).toBeTruthy();
      }
      expect(screen.getByText("+2")).toBeTruthy();
    });
  });

  describe("When there is exactly one connection", () => {
    it("should display the connection without an overflow indicator", () => {
      const user = createMockConnectionUser();
      render(
        <ConnectedUsersGrid users={[user]} onUserPress={mockOnUserPress} />
      );

      expect(screen.getByText(user.name)).toBeTruthy();
      expect(screen.queryByText(/^\+\d+$/)).toBeNull();
    });
  });
});
