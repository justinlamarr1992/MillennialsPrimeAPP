/**
 * Tests for useVideoUpload hook
 * TDD — tests written before implementation
 * Target coverage: 90%
 *
 * Behavior-focused: tests verify observable state (phase, progress, error,
 * selectedFile) only. Service internals are fully mocked.
 */

import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useVideoUpload } from "../useVideoUpload";
import { videoUploadService } from "@/services/videoUploadService";
import useAxiosPrivate from "../useAxiosPrivate";
import type { ImagePickerResult } from "expo-image-picker";
import type { VideoUploadFormData } from "@/types/videoUpload";

jest.mock("../useAxiosPrivate");
jest.mock("@/services/videoUploadService");
jest.mock("@/utils/logger");

const mockUseAxiosPrivate = useAxiosPrivate as jest.MockedFunction<
  typeof useAxiosPrivate
>;
const mockVideoUploadService = videoUploadService as jest.Mocked<
  typeof videoUploadService
>;

describe("useVideoUpload", () => {
  const mockAxiosPrivate = {} as ReturnType<typeof useAxiosPrivate>;

  const validForm: VideoUploadFormData = {
    title: "Breaking News",
    description: "A great video",
    category: "All News",
    audience: "millennials",
  };

  const mockVideoAsset = {
    uri: "file:///video.mp4",
    type: "video",
    fileName: "video.mp4",
    mimeType: "video/mp4",
    fileSize: 1024 * 1024,
    duration: 60,
  };

  const mockPickerResult: ImagePickerResult = {
    canceled: false,
    assets: [mockVideoAsset as never],
  };

  const canceledPickerResult: ImagePickerResult = {
    canceled: true,
    assets: null,
  };

  const mockBunnyResponse = {
    guid: "test-guid-123",
    videoLibraryId: "147838",
  };

  const mockAuthResponse = {
    success: true,
    shaAttempt: "sha-abc",
    authorizationExpire: 9999999999,
    video_id: "test-guid-123",
    libraryId: 147838,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxiosPrivate.mockReturnValue(mockAxiosPrivate);

    mockVideoUploadService.createBunnyCDNVideo.mockResolvedValue(
      mockBunnyResponse
    );
    mockVideoUploadService.getUploadAuth.mockResolvedValue(mockAuthResponse);
    mockVideoUploadService.performTusUpload.mockResolvedValue(undefined);
    mockVideoUploadService.updateBunnyCDNMetadata.mockResolvedValue(undefined);
    mockVideoUploadService.saveVideoRecord.mockResolvedValue(undefined);
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("starts idle with no file, no error, and zero progress", () => {
      const { result } = renderHook(() => useVideoUpload());

      expect(result.current.phase).toBe("idle");
      expect(result.current.progress).toBe(0);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedFile).toBeNull();
    });
  });

  // ─── handleVideoSelect ──────────────────────────────────────────────────────

  describe("handleVideoSelect", () => {
    it("records selected file when picker returns an asset", () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      expect(result.current.selectedFile).toEqual(mockVideoAsset);
    });

    it("leaves selectedFile null when picker is canceled", () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(canceledPickerResult);
      });

      expect(result.current.selectedFile).toBeNull();
    });

    it("leaves selectedFile null when assets array is empty", () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect({ canceled: false, assets: [] });
      });

      expect(result.current.selectedFile).toBeNull();
    });
  });

  // ─── reset ──────────────────────────────────────────────────────────────────

  describe("reset", () => {
    it("returns to idle with cleared file, error, and progress", async () => {
      mockVideoUploadService.createBunnyCDNVideo.mockRejectedValueOnce(
        new Error("CDN error")
      );

      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      // Ensure we are in error state before resetting
      expect(result.current.phase).toBe("error");

      act(() => {
        result.current.reset();
      });

      expect(result.current.phase).toBe("idle");
      expect(result.current.selectedFile).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.progress).toBe(0);
    });
  });

  // ─── submitUpload validation ────────────────────────────────────────────────

  describe("submitUpload — missing fields", () => {
    it("enters error state with a message about title when title is empty", async () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload({ ...validForm, title: "" });
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toMatch(/title/i);
    });

    it("enters error state with a message about description when description is empty", async () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload({ ...validForm, description: "" });
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toMatch(/description/i);
    });

    it("enters error state with a message about category when category is empty", async () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload({ ...validForm, category: "" });
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toMatch(/category/i);
    });

    it("enters error state with a message about video when no file is selected", async () => {
      const { result } = renderHook(() => useVideoUpload());
      // Intentionally skip handleVideoSelect

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toMatch(/video/i);
    });
  });

  // ─── submitUpload happy path ────────────────────────────────────────────────

  describe("submitUpload — successful upload", () => {
    it("reaches complete phase after a successful upload", async () => {
      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      await waitFor(() => {
        expect(result.current.phase).toBe("complete");
      });

      expect(result.current.error).toBeNull();
    });

    it("reflects progress updates during upload", async () => {
      mockVideoUploadService.performTusUpload.mockImplementation(
        async (_file, _auth, onProgress) => {
          onProgress(25);
          onProgress(75);
          onProgress(100);
        }
      );

      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      await waitFor(() => {
        expect(result.current.phase).toBe("complete");
      });
    });
  });

  // ─── submitUpload error paths ───────────────────────────────────────────────

  describe("submitUpload — service errors", () => {
    it("enters error state when video creation fails", async () => {
      mockVideoUploadService.createBunnyCDNVideo.mockRejectedValueOnce(
        new Error("CDN creation failed")
      );

      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toBeTruthy();
    });

    it("enters error state when getting upload auth fails", async () => {
      mockVideoUploadService.getUploadAuth.mockRejectedValueOnce(
        new Error("Auth failed")
      );

      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      expect(result.current.phase).toBe("error");
      expect(result.current.error).toBeTruthy();
    });

    it("enters error state when TUS upload fails", async () => {
      mockVideoUploadService.performTusUpload.mockRejectedValueOnce(
        new Error("TUS failed")
      );

      const { result } = renderHook(() => useVideoUpload());

      act(() => {
        result.current.handleVideoSelect(mockPickerResult);
      });

      await act(async () => {
        await result.current.submitUpload(validForm);
      });

      await waitFor(() => {
        expect(result.current.phase).toBe("error");
      });

      expect(result.current.error).toBeTruthy();
    });
  });
});
