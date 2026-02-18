/**
 * Tests for UploadContentScreen
 * TDD — tests written before implementation
 * Target coverage: 80%
 *
 * Behavior-focused: verifies what users see based on profile state.
 * useUserProfile hook and UploadBox are fully mocked.
 */

import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import UploadContentScreen from "../UploadContentScreen";
import { useUserProfile } from "@/hooks/useUserProfile";

jest.mock("@/hooks/useUserProfile");
jest.mock("@/shared/Upload/UploadBox", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/hooks/useAxiosPrivate", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock("@/utils/logger");

const mockUseUserProfile = useUserProfile as jest.MockedFunction<
  typeof useUserProfile
>;

type ProfileReturn = ReturnType<typeof useUserProfile>;

const makeProfile = (overrides: Partial<ProfileReturn> = {}): ProfileReturn => ({
  profile: null,
  loading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

describe("UploadContentScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Loading state ───────────────────────────────────────────────────────────

  describe("while profile is loading", () => {
    it("shows a loading indicator accessible to screen readers", () => {
      mockUseUserProfile.mockReturnValue(makeProfile({ loading: true }));

      render(<UploadContentScreen />);

      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });

    it("does not show the content-creators-only message while loading", () => {
      mockUseUserProfile.mockReturnValue(makeProfile({ loading: true }));

      render(<UploadContentScreen />);

      expect(screen.queryByText(/content creators only/i)).toBeNull();
    });
  });

  // ─── Profile fetch error ─────────────────────────────────────────────────────

  describe("when the profile fetch fails", () => {
    it("shows an error message", () => {
      mockUseUserProfile.mockReturnValue(
        makeProfile({ error: new Error("Network request failed") })
      );

      render(<UploadContentScreen />);

      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });

    it("does not show the Content Creators Only message on a fetch error", () => {
      mockUseUserProfile.mockReturnValue(
        makeProfile({ error: new Error("Network request failed") })
      );

      render(<UploadContentScreen />);

      expect(screen.queryByText(/content creators only/i)).toBeNull();
    });
  });

  // ─── Non-prime user ──────────────────────────────────────────────────────────

  describe("when user is not a prime content creator", () => {
    it("shows the Content Creators Only message", () => {
      mockUseUserProfile.mockReturnValue(
        makeProfile({ profile: { prime: false } as never })
      );

      render(<UploadContentScreen />);

      expect(screen.getByText(/content creators only/i)).toBeTruthy();
    });

    it("shows the explanatory subtitle", () => {
      mockUseUserProfile.mockReturnValue(
        makeProfile({ profile: { prime: false } as never })
      );

      render(<UploadContentScreen />);

      expect(screen.getByText(/available to prime content creators/i)).toBeTruthy();
    });
  });

  // ─── Prime user ──────────────────────────────────────────────────────────────

  describe("when user is a prime content creator", () => {
    it("does not show the Content Creators Only message", () => {
      mockUseUserProfile.mockReturnValue(
        makeProfile({ profile: { prime: true } as never })
      );

      render(<UploadContentScreen />);

      expect(screen.queryByText(/content creators only/i)).toBeNull();
    });
  });
});
