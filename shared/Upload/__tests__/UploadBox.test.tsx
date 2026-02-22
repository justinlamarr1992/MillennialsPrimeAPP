/**
 * Tests for UploadBox component
 * TDD — tests written before refactor
 * Target coverage: 80%
 *
 * Behavior-focused: verifies what users see and can interact with.
 * useVideoUpload hook is fully mocked.
 */

import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render, screen } from "@/__tests__/test-utils";
import UploadBox from "../UploadBox";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import type { UploadPhase } from "@/types/videoUpload";

jest.mock("@/hooks/useVideoUpload");
jest.mock("@/hooks/useAxiosPrivate", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock("@/shared/Upload/ImagePickerComponent", () => {
  const { View, Button } = require("react-native");
  return {
    __esModule: true,
    default: ({
      handleVideoSelect,
    }: {
      handleVideoSelect: (result: {
        canceled: false;
        assets: { uri: string }[];
      }) => void;
    }) => (
      <View testID="image-picker">
        <Button
          testID="mock-video-select"
          title="Select Video"
          onPress={() =>
            handleVideoSelect({
              canceled: false,
              assets: [{ uri: "test://video.mp4" }],
            })
          }
        />
      </View>
    ),
  };
});
jest.mock("@/utils/logger");

const mockUseVideoUpload = useVideoUpload as jest.MockedFunction<
  typeof useVideoUpload
>;

const makeHookReturn = (
  overrides: Partial<ReturnType<typeof useVideoUpload>> = {}
): ReturnType<typeof useVideoUpload> => ({
  phase: "idle" as UploadPhase,
  progress: 0,
  error: null,
  selectedFile: null,
  handleVideoSelect: jest.fn(),
  submitUpload: jest.fn(),
  reset: jest.fn(),
  ...overrides,
});

describe("UploadBox", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseVideoUpload.mockReturnValue(makeHookReturn());
  });

  // ─── Initial render ─────────────────────────────────────────────────────────

  describe("initial render", () => {
    it("shows the upload type picker field", () => {
      render(<UploadBox />);
      expect(
        screen.getByPlaceholderText(/what type/i)
      ).toBeTruthy();
    });

    it("shows the Upload button", () => {
      render(<UploadBox />);
      expect(screen.getByText("Upload")).toBeTruthy();
    });

    it("shows the screen title", () => {
      render(<UploadBox />);
      expect(screen.getByText(/millennial/i)).toBeTruthy();
    });
  });

  // ─── Video upload form ──────────────────────────────────────────────────────

  describe("when Video is selected as upload type", () => {
    beforeEach(() => {
      render(<UploadBox />);
      // Press the Pressable that wraps the upload type TextInput
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      // Picker is now rendered — trigger value change
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
    });

    it("shows the Title field", () => {
      expect(screen.getByPlaceholderText(/enter title/i)).toBeTruthy();
    });

    it("shows the Description field", () => {
      expect(screen.getByPlaceholderText(/description/i)).toBeTruthy();
    });

    it("shows the video picker component", () => {
      expect(screen.getByTestId("image-picker")).toBeTruthy();
    });
  });

  // ─── Upload button validation ───────────────────────────────────────────────

  describe("Upload button", () => {
    it("is accessible with accessibilityRole button", () => {
      render(<UploadBox />);
      const uploadButton = screen.getByRole("button", { name: "Upload" });
      expect(uploadButton).toBeTruthy();
    });

    it("keeps the form visible after pressing Upload with Video type selected", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      fireEvent.press(screen.getByRole("button", { name: "Upload" }));

      // Form remains visible; no error banner appeared
      expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
      expect(screen.queryByText(/network error/i)).toBeNull();
    });
  });

  // ─── Disabled state / required-field validation ─────────────────────────────

  describe("Upload button disabled state", () => {
    it("is disabled before any fields are filled", () => {
      render(<UploadBox />);
      const button = screen.getByRole("button", { name: "Upload" });
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it("is disabled after selecting Video type but before filling title and category", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      const button = screen.getByRole("button", { name: "Upload" });
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it("is disabled when title and category are filled but no video selected", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      fireEvent.changeText(screen.getByPlaceholderText(/enter title/i), "My Video");
      fireEvent.press(screen.getByRole("button", { name: "Select category" }));
      fireEvent(screen.getByTestId("category-picker"), "valueChange", "Music");
      const button = screen.getByRole("button", { name: "Upload" });
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it("becomes enabled when upload type, title, category, and video are all provided", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      fireEvent.changeText(screen.getByPlaceholderText(/enter title/i), "My Video");
      fireEvent.press(screen.getByRole("button", { name: "Select category" }));
      fireEvent(screen.getByTestId("category-picker"), "valueChange", "Music");
      fireEvent.press(screen.getByTestId("mock-video-select"));
      const button = screen.getByRole("button", { name: "Upload" });
      expect(button.props.accessibilityState?.disabled).toBe(false);
    });

    it("description is not required — button enabled without it", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      fireEvent.changeText(screen.getByPlaceholderText(/enter title/i), "My Video");
      // description intentionally left blank
      fireEvent.press(screen.getByRole("button", { name: "Select category" }));
      fireEvent(screen.getByTestId("category-picker"), "valueChange", "Music");
      fireEvent.press(screen.getByTestId("mock-video-select"));
      const button = screen.getByRole("button", { name: "Upload" });
      expect(button.props.accessibilityState?.disabled).toBe(false);
    });
  });

  // ─── Required field indicators ───────────────────────────────────────────────

  describe("Required field indicators", () => {
    it("shows asterisk on upload type label", () => {
      render(<UploadBox />);
      expect(screen.getByText(/What type of Upload is this\? \*/)).toBeTruthy();
    });

    it("shows asterisk on title label when video form is visible", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      expect(screen.getByText(/Title of Video \*/)).toBeTruthy();
    });

    it("shows asterisk on category label when video form is visible", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      expect(screen.getByText(/Category \*/)).toBeTruthy();
    });

    it("does not show asterisk on description label", () => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      expect(
        screen.getByText(/Description of the Video/)
      ).not.toHaveTextContent("*");
    });
  });

  // ─── Audience picker ────────────────────────────────────────────────────────

  describe("Audience picker (when Video is selected)", () => {
    beforeEach(() => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
    });

    it("shows the audience selector button", () => {
      expect(screen.getByRole("button", { name: "Select audience" })).toBeTruthy();
    });

    it("opens the audience picker when the button is pressed", () => {
      fireEvent.press(screen.getByRole("button", { name: "Select audience" }));
      expect(screen.getByTestId("audience-picker")).toBeTruthy();
    });

    it("closes the audience picker after a value is selected", () => {
      fireEvent.press(screen.getByRole("button", { name: "Select audience" }));
      fireEvent(screen.getByTestId("audience-picker"), "valueChange", "primes");
      expect(screen.queryByTestId("audience-picker")).toBeNull();
    });
  });

  // ─── Category picker ────────────────────────────────────────────────────────

  describe("Category picker (when Video is selected)", () => {
    beforeEach(() => {
      render(<UploadBox />);
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
    });

    it("shows the category selector button", () => {
      expect(screen.getByRole("button", { name: "Select category" })).toBeTruthy();
    });

    it("opens the category picker when the button is pressed", () => {
      fireEvent.press(screen.getByRole("button", { name: "Select category" }));
      expect(screen.getByTestId("category-picker")).toBeTruthy();
    });

    it("closes the category picker after a value is selected", () => {
      fireEvent.press(screen.getByRole("button", { name: "Select category" }));
      fireEvent(screen.getByTestId("category-picker"), "valueChange", "Politics");
      expect(screen.queryByTestId("category-picker")).toBeNull();
    });
  });

  // ─── Upload progress state ──────────────────────────────────────────────────

  describe("while upload is in progress", () => {
    it("shows a progress indicator when phase is uploading", () => {
      mockUseVideoUpload.mockReturnValue(
        makeHookReturn({ phase: "uploading", progress: 50 })
      );

      render(<UploadBox />);
      expect(screen.getByText(/uploading/i)).toBeTruthy();
    });

    it("shows authorizing state text when phase is authorizing", () => {
      mockUseVideoUpload.mockReturnValue(
        makeHookReturn({ phase: "authorizing" })
      );

      render(<UploadBox />);
      expect(screen.getByText(/authorizing/i)).toBeTruthy();
    });
  });

  // ─── Success state ──────────────────────────────────────────────────────────

  describe("after successful upload", () => {
    it("shows a success message", () => {
      mockUseVideoUpload.mockReturnValue(makeHookReturn({ phase: "complete" }));

      render(<UploadBox />);
      expect(screen.getByText("Video Uploaded!")).toBeTruthy();
    });

    it("shows an Upload Another button", () => {
      mockUseVideoUpload.mockReturnValue(makeHookReturn({ phase: "complete" }));

      render(<UploadBox />);
      expect(screen.getByRole("button", { name: /upload another/i })).toBeTruthy();
    });
  });

  // ─── Error state ────────────────────────────────────────────────────────────

  describe("when upload fails", () => {
    it("shows the error message", () => {
      mockUseVideoUpload.mockReturnValue(
        makeHookReturn({
          phase: "error",
          error: "Network error. Please try again.",
        })
      );

      render(<UploadBox />);
      expect(screen.getByText(/network error/i)).toBeTruthy();
    });

    it("shows a Try Again button", () => {
      mockUseVideoUpload.mockReturnValue(
        makeHookReturn({
          phase: "error",
          error: "Something went wrong.",
        })
      );

      render(<UploadBox />);
      expect(screen.getByRole("button", { name: /try again/i })).toBeTruthy();
    });

    it("clears the video form and resets to initial state when Try Again is pressed", () => {
      // In error phase the full form is still rendered beneath the error banner
      mockUseVideoUpload.mockReturnValue(
        makeHookReturn({ phase: "error", error: "Something failed." })
      );

      render(<UploadBox />);

      // Navigate into video form
      fireEvent.press(screen.getByRole("button", { name: "Select upload type" }));
      fireEvent(screen.getByTestId("upload-type-picker"), "valueChange", "Video");
      expect(screen.getByPlaceholderText(/enter title/i)).toBeTruthy();

      // Pressing Try Again should reset uploadType → null, hiding the video form
      fireEvent.press(screen.getByRole("button", { name: /try again/i }));
      expect(screen.queryByPlaceholderText(/enter title/i)).toBeNull();
    });
  });
});
