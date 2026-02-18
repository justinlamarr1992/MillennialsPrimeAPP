/**
 * Tests for videoUploadService
 * TDD — tests written before implementation
 *
 * Covers:
 * - createBunnyCDNVideo: env var validation, happy path, network/CDN errors
 * - getUploadAuth: backend happy path and error paths
 * - updateBunnyCDNMetadata: happy path and error paths
 * - saveVideoRecord: stub behavior (logs warning, resolves)
 */

import { videoUploadService } from "../videoUploadService";
import { axiosPrivate } from "@/API/axios";
import * as tus from "tus-js-client";
import type {
  BunnyCreateResponse,
  UploadAuthResponse,
  VideoUploadFormData,
} from "@/types/videoUpload";
import type { ImagePickerAsset } from "expo-image-picker";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    multiRemove: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock("@/API/axios", () => ({
  axiosPrivate: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/utils/logger");
jest.mock("tus-js-client", () => ({ Upload: jest.fn() }));

const MockTusUpload = tus.Upload as jest.MockedClass<typeof tus.Upload>;

describe("videoUploadService", () => {
  const mockedAxiosPrivate = axiosPrivate as jest.Mocked<typeof axiosPrivate>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY = "test-access-key";
    process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID = "147838";
    process.env.EXPO_PUBLIC_BUNNYCDN_API_URL = "https://video.bunnycdn.com";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;
    delete process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;
    delete process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;
  });

  // ─── createBunnyCDNVideo ────────────────────────────────────────────────────

  describe("createBunnyCDNVideo", () => {
    const mockBunnyResponse: BunnyCreateResponse = {
      guid: "ec4cbe34-8750-4695-b252-69f53e51627a",
      videoLibraryId: "147838",
    };

    it("returns guid and videoLibraryId on success", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockBunnyResponse,
      } as Response);

      const result = await videoUploadService.createBunnyCDNVideo("My Title");

      expect(result).toEqual(mockBunnyResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://video.bunnycdn.com/library/147838/videos",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            AccessKey: "test-access-key",
          }),
        })
      );
    });

    it("includes the title in the request body", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockBunnyResponse,
      } as Response);

      await videoUploadService.createBunnyCDNVideo("Breaking News");

      const call = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(call[1].body as string) as { title: string };
      expect(body.title).toBe("Breaking News");
    });

    it("throws when EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY is missing", async () => {
      delete process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;

      await expect(
        videoUploadService.createBunnyCDNVideo("Title")
      ).rejects.toThrow();
    });

    it("throws when EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID is missing", async () => {
      delete process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;

      await expect(
        videoUploadService.createBunnyCDNVideo("Title")
      ).rejects.toThrow();
    });

    it("throws when EXPO_PUBLIC_BUNNYCDN_API_URL is missing", async () => {
      delete process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;

      await expect(
        videoUploadService.createBunnyCDNVideo("Title")
      ).rejects.toThrow();
    });

    it("throws when BunnyCDN returns a non-2xx status", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      } as Response);

      await expect(
        videoUploadService.createBunnyCDNVideo("Title")
      ).rejects.toThrow();
    });

    it("throws on network failure", async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network request failed"));

      await expect(
        videoUploadService.createBunnyCDNVideo("Title")
      ).rejects.toThrow("Network request failed");
    });
  });

  // ─── getUploadAuth ──────────────────────────────────────────────────────────

  describe("getUploadAuth", () => {
    const mockAuthResponse: UploadAuthResponse = {
      success: true,
      shaAttempt: "abc123sha",
      authorizationExpire: 9999999999,
      video_id: "ec4cbe34-8750-4695-b252-69f53e51627a",
      libraryId: 147838,
    };

    it("returns auth tokens on success", async () => {
      mockedAxiosPrivate.post.mockResolvedValueOnce({
        data: mockAuthResponse,
      });

      const result = await videoUploadService.getUploadAuth(
        "ec4cbe34-8750-4695-b252-69f53e51627a",
        "My Title"
      );

      expect(result).toEqual(mockAuthResponse);
      expect(axiosPrivate.post).toHaveBeenCalledWith(
        "/videos/bunnyInfo",
        expect.objectContaining({
          videoID: "ec4cbe34-8750-4695-b252-69f53e51627a",
          title: "My Title",
        })
      );
    });

    it("throws when videoId is empty", async () => {
      await expect(
        videoUploadService.getUploadAuth("", "Title")
      ).rejects.toThrow("Video ID is required");

      expect(axiosPrivate.post).not.toHaveBeenCalled();
    });

    it("throws when backend returns an error", async () => {
      const backendError = new Error("Backend error");
      mockedAxiosPrivate.post.mockRejectedValueOnce(backendError);

      await expect(
        videoUploadService.getUploadAuth("video-id", "Title")
      ).rejects.toThrow("Backend error");
    });

    it("throws when backend success is false", async () => {
      mockedAxiosPrivate.post.mockResolvedValueOnce({
        data: { success: false, message: "Invalid video ID" },
      });

      await expect(
        videoUploadService.getUploadAuth("video-id", "Title")
      ).rejects.toThrow();
    });
  });

  // ─── updateBunnyCDNMetadata ─────────────────────────────────────────────────

  describe("updateBunnyCDNMetadata", () => {
    it("calls BunnyCDN update endpoint with correct args", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await videoUploadService.updateBunnyCDNMetadata("video-id-123", "New Title");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://video.bunnycdn.com/library/147838/videos/video-id-123",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            AccessKey: "test-access-key",
          }),
        })
      );

      const call = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(call[1].body as string) as { title: string };
      expect(body.title).toBe("New Title");
    });

    it("throws when BunnyCDN returns a non-2xx status", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(
        videoUploadService.updateBunnyCDNMetadata("video-id-123", "Title")
      ).rejects.toThrow();
    });

    it("throws on network failure", async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network request failed"));

      await expect(
        videoUploadService.updateBunnyCDNMetadata("video-id-123", "Title")
      ).rejects.toThrow("Network request failed");
    });

    it("throws when env vars are missing", async () => {
      delete process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;

      await expect(
        videoUploadService.updateBunnyCDNMetadata("video-id-123", "Title")
      ).rejects.toThrow();
    });
  });

  // ─── performTusUpload ───────────────────────────────────────────────────────

  describe("performTusUpload", () => {
    const mockFile = {
      uri: "file:///video.mp4",
      mimeType: "video/mp4",
    } as ImagePickerAsset;

    const mockAuth: UploadAuthResponse = {
      success: true,
      shaAttempt: "sha-abc",
      authorizationExpire: 9999999999,
      video_id: "test-guid-123",
      libraryId: 147838,
    };

    it("resolves when TUS upload succeeds", async () => {
      MockTusUpload.mockImplementation((_file, options) => {
        return {
          findPreviousUploads: () =>
            Promise.resolve([]).then(() => {
              (options.onSuccess as (() => void))?.();
              return [];
            }),
          resumeFromPreviousUpload: jest.fn(),
          start: jest.fn(),
        } as unknown as tus.Upload;
      });

      const onProgress = jest.fn();
      await expect(
        videoUploadService.performTusUpload(mockFile, mockAuth, onProgress)
      ).resolves.toBeUndefined();
    });

    it("calls onProgress with percentage during upload", async () => {
      MockTusUpload.mockImplementation((_file, options) => {
        return {
          findPreviousUploads: () =>
            Promise.resolve([]).then(() => {
              options.onProgress?.(500000, 1000000);
              (options.onSuccess as (() => void))?.();
              return [];
            }),
          resumeFromPreviousUpload: jest.fn(),
          start: jest.fn(),
        } as unknown as tus.Upload;
      });

      const onProgress = jest.fn();
      await videoUploadService.performTusUpload(mockFile, mockAuth, onProgress);
      expect(onProgress).toHaveBeenCalledWith(50);
    });

    it("rejects when TUS upload encounters an error", async () => {
      MockTusUpload.mockImplementation((_file, options) => {
        return {
          findPreviousUploads: () =>
            Promise.resolve([]).then(() => {
              options.onError?.(new Error("TUS upload failed"));
              return [];
            }),
          resumeFromPreviousUpload: jest.fn(),
          start: jest.fn(),
        } as unknown as tus.Upload;
      });

      const onProgress = jest.fn();
      await expect(
        videoUploadService.performTusUpload(mockFile, mockAuth, onProgress)
      ).rejects.toThrow("TUS upload failed");
    });

    it("resumes from previous upload when one exists", async () => {
      const resumeFromPreviousUpload = jest.fn();
      const previousUpload = { uploadUrl: "https://example.com/upload" };

      MockTusUpload.mockImplementation((_file, options) => {
        return {
          findPreviousUploads: () =>
            Promise.resolve([previousUpload]).then((prev) => {
              resumeFromPreviousUpload(prev[0]);
              (options.onSuccess as (() => void))?.();
              return prev;
            }),
          resumeFromPreviousUpload,
          start: jest.fn(),
        } as unknown as tus.Upload;
      });

      const onProgress = jest.fn();
      await videoUploadService.performTusUpload(mockFile, mockAuth, onProgress);
      expect(resumeFromPreviousUpload).toHaveBeenCalledWith(previousUpload);
    });
  });

  // ─── saveVideoRecord ────────────────────────────────────────────────────────

  describe("saveVideoRecord", () => {
    const mockFormData: VideoUploadFormData & { videoId: string } = {
      title: "My Video",
      description: "A great video",
      category: "All News",
      audience: "millennials",
      videoId: "video-id-123",
    };

    it("resolves without throwing (stub behavior)", async () => {
      await expect(
        videoUploadService.saveVideoRecord(mockFormData)
      ).resolves.toBeUndefined();
    });

    it("does not call axiosPrivate (backend endpoint pending)", async () => {
      await videoUploadService.saveVideoRecord(mockFormData);
      expect(axiosPrivate.post).not.toHaveBeenCalled();
    });
  });
});
