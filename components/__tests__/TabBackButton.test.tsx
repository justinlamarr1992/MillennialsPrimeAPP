import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import { TabBackButton, TabHeaderTitle } from "../TabBackButton";
import { router } from "expo-router";
import { useNavigationState } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigationState: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("TabBackButton", () => {
  const mockUseNavigationState = useNavigationState as jest.MockedFunction<
    typeof useNavigationState
  >;
  const mockRouterBack = router.back as jest.MockedFunction<typeof router.back>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given there is no previous screen to go back to", () => {
    beforeEach(() => {
      mockUseNavigationState.mockReturnValue(null);
    });

    it("renders nothing — user sees no back button", () => {
      const { toJSON } = render(<TabBackButton />);
      expect(toJSON()).toBeNull();
    });
  });

  describe("Given there is a previous screen", () => {
    beforeEach(() => {
      mockUseNavigationState.mockReturnValue("Social");
    });

    it("shows the name of the previous screen as the back label", () => {
      render(<TabBackButton />);
      expect(screen.getByText("Social")).toBeTruthy();
    });

    it("navigates back when the user taps it", () => {
      render(<TabBackButton />);
      fireEvent.press(screen.getByRole("button"));
      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });

    it("does not navigate if not tapped", () => {
      render(<TabBackButton />);
      expect(mockRouterBack).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has accessibilityRole of button", () => {
      mockUseNavigationState.mockReturnValue("Social");
      render(<TabBackButton />);
      expect(screen.getByRole("button")).toBeTruthy();
    });

    it("announces the previous screen name to screen readers", () => {
      mockUseNavigationState.mockReturnValue("My Profile");
      render(<TabBackButton />);
      expect(screen.getByLabelText("Go back to My Profile")).toBeTruthy();
    });

    it("provides a hint describing the action", () => {
      mockUseNavigationState.mockReturnValue("Social");
      render(<TabBackButton />);
      const button = screen.getByRole("button");
      expect(button.props.accessibilityHint).toBe(
        "Navigate to the previous screen"
      );
    });
  });

  describe("Given various previous screen names", () => {
    it.each([
      ["Social"],
      ["Settings"],
      ["My Profile"],
      ["Connections"],
      ["Edit Profile"],
      ["Profile"],
      ["My Info"],
      ["Business"],
      ["Art"],
    ])("displays '%s' as the back label", (label) => {
      mockUseNavigationState.mockReturnValue(label);
      render(<TabBackButton />);
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  describe("Given real navigation state (TabBackButton)", () => {
    it("shows nothing when user is on the root Social screen", () => {
      mockUseNavigationState.mockImplementation((selector) =>
        selector({
          index: 0,
          routes: [{ name: "(social)", state: { index: 0, routes: [{ name: "index" }] } }],
        } as never)
      );
      const { toJSON } = render(<TabBackButton />);
      expect(toJSON()).toBeNull();
    });

    it("shows '← Social' when user navigated from Social feed to My Profile", () => {
      mockUseNavigationState.mockImplementation((selector) =>
        selector({
          index: 0,
          routes: [
            {
              name: "(social)",
              state: {
                index: 1,
                routes: [{ name: "index" }, { name: "MyProfileScreen" }],
              },
            },
          ],
        } as never)
      );
      render(<TabBackButton />);
      expect(screen.getByText("Social")).toBeTruthy();
    });

    it("shows '← My Profile' when user navigated from My Profile to Connections", () => {
      mockUseNavigationState.mockImplementation((selector) =>
        selector({
          index: 0,
          routes: [
            {
              name: "(social)",
              state: {
                index: 2,
                routes: [
                  { name: "index" },
                  { name: "MyProfileScreen" },
                  { name: "ConnectedUsersScreen" },
                ],
              },
            },
          ],
        } as never)
      );
      render(<TabBackButton />);
      expect(screen.getByText("My Profile")).toBeTruthy();
    });

    it("shows nothing when navigation state is null", () => {
      mockUseNavigationState.mockImplementation((selector) =>
        selector(null as never)
      );
      const { toJSON } = render(<TabBackButton />);
      expect(toJSON()).toBeNull();
    });
  });
});

describe("TabHeaderTitle", () => {
  const mockUseNavigationState = useNavigationState as jest.MockedFunction<
    typeof useNavigationState
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'Social' when user is at the Social feed root", () => {
    mockUseNavigationState.mockImplementation((selector) =>
      selector({
        index: 0,
        routes: [{ name: "(social)", state: { index: 0, routes: [{ name: "index" }] } }],
      } as never)
    );
    render(<TabHeaderTitle defaultTitle="Social" />);
    expect(screen.getByText("Social")).toBeTruthy();
  });

  it("shows 'My Profile' when user navigated from Social to My Profile", () => {
    mockUseNavigationState.mockImplementation((selector) =>
      selector({
        index: 0,
        routes: [
          {
            name: "(social)",
            state: {
              index: 1,
              routes: [{ name: "index" }, { name: "MyProfileScreen" }],
            },
          },
        ],
      } as never)
    );
    render(<TabHeaderTitle defaultTitle="Social" />);
    expect(screen.getByText("My Profile")).toBeTruthy();
  });

  it("shows 'Connections' when user navigated from My Profile to Connections", () => {
    mockUseNavigationState.mockImplementation((selector) =>
      selector({
        index: 0,
        routes: [
          {
            name: "(social)",
            state: {
              index: 2,
              routes: [
                { name: "index" },
                { name: "MyProfileScreen" },
                { name: "ConnectedUsersScreen" },
              ],
            },
          },
        ],
      } as never)
    );
    render(<TabHeaderTitle defaultTitle="Social" />);
    expect(screen.getByText("Connections")).toBeTruthy();
  });

  it("shows 'Social' when navigation state is unavailable", () => {
    mockUseNavigationState.mockImplementation((selector) =>
      selector(null as never)
    );
    render(<TabHeaderTitle defaultTitle="Social" />);
    expect(screen.getByText("Social")).toBeTruthy();
  });
});
