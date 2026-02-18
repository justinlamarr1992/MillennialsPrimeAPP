/**
 * Service for managing video upload to BunnyCDN
 *
 * API Contract:
 * - POST /videos/bunnyInfo — backend generates TUS authorization tokens
 *
 * BunnyCDN endpoints (uses EXPO_PUBLIC_* env vars, never hardcoded credentials):
 * - POST {apiUrl}/library/{libraryId}/videos — create video slot
 * - POST {apiUrl}/library/{libraryId}/videos/{videoId} — update metadata
 *
 * Backend gap: POST /videos/save not yet implemented.
 * saveVideoRecord is a stub ready for when that endpoint exists.
 */

import { Upload } from "tus-js-client";
import { axiosPrivate } from "@/API/axios";
import { logger } from "@/utils/logger";
import type { ImagePickerAsset } from "expo-image-picker";
import type {
  BunnyCreateResponse,
  UploadAuthResponse,
  VideoUploadFormData,
} from "@/types/videoUpload";

interface BunnyCDNEnvConfig {
  accessKey: string;
  libraryId: string;
  apiUrl: string;
}

function getBunnyCDNConfig(): BunnyCDNEnvConfig {
  const accessKey = process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;
  const libraryId = process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;
  const apiUrl = process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;

  const missing: string[] = [];
  if (!accessKey?.trim()) missing.push("EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY");
  if (!libraryId?.trim()) missing.push("EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID");
  if (!apiUrl?.trim()) missing.push("EXPO_PUBLIC_BUNNYCDN_API_URL");

  if (missing.length > 0) {
    throw new Error(
      `Missing BunnyCDN environment variables: ${missing.join(", ")}`
    );
  }

  return {
    accessKey: accessKey as string,
    libraryId: libraryId as string,
    apiUrl: apiUrl as string,
  };
}

export const videoUploadService = {
  /**
   * Create a video slot in BunnyCDN.
   * Called once at submit time — never on upload-type selection.
   *
   * @param title — working title used by BunnyCDN until metadata is updated
   * @returns BunnyCDN guid and videoLibraryId
   */
  async createBunnyCDNVideo(title: string): Promise<BunnyCreateResponse> {
    const { accessKey, libraryId, apiUrl } = getBunnyCDNConfig();

    logger.api("POST", `${apiUrl}/library/${libraryId}/videos`);

    const response = await fetch(`${apiUrl}/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: accessKey,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      logger.error(
        `❌ BunnyCDN video creation failed: ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Failed to create video in BunnyCDN (${response.status})`
      );
    }

    const data = (await response.json()) as BunnyCreateResponse;
    logger.log("✅ BunnyCDN video slot created:", data.guid);
    return data;
  },

  /**
   * Get TUS upload authorization from the backend.
   *
   * @param videoId — BunnyCDN video guid from createBunnyCDNVideo
   * @param title — video title for backend reference
   * @returns TUS auth tokens (shaAttempt, authorizationExpire, libraryId, etc.)
   */
  async getUploadAuth(
    videoId: string,
    title: string
  ): Promise<UploadAuthResponse> {
    if (!videoId) {
      throw new Error("Video ID is required");
    }

    logger.api("POST", "/videos/bunnyInfo", { videoId });

    const response = await axiosPrivate.post<UploadAuthResponse>(
      "/videos/bunnyInfo",
      { videoID: videoId, title }
    );

    if (!response.data.success) {
      logger.error("❌ Backend returned success=false for TUS auth");
      throw new Error("Failed to obtain upload authorization from server");
    }

    logger.log("✅ TUS auth obtained");
    return response.data;
  },

  /**
   * Update BunnyCDN video metadata after a successful TUS upload.
   *
   * @param videoId — BunnyCDN video guid
   * @param title — final video title
   */
  async updateBunnyCDNMetadata(videoId: string, title: string): Promise<void> {
    const { accessKey, libraryId, apiUrl } = getBunnyCDNConfig();

    logger.api("POST", `${apiUrl}/library/${libraryId}/videos/${videoId}`);

    const response = await fetch(
      `${apiUrl}/library/${libraryId}/videos/${videoId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          AccessKey: accessKey,
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!response.ok) {
      logger.error(
        `❌ BunnyCDN metadata update failed: ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Failed to update video metadata in BunnyCDN (${response.status})`
      );
    }

    logger.log("✅ BunnyCDN metadata updated for video:", videoId);
  },

  /**
   * Perform the TUS resumable upload to BunnyCDN.
   * Wraps the callback-based TUS API in a Promise.
   *
   * @param file — video file asset from expo-image-picker
   * @param auth — TUS authorization tokens from getUploadAuth
   * @param onProgress — called with upload percentage (0–100)
   */
  async performTusUpload(
    file: ImagePickerAsset,
    auth: UploadAuthResponse,
    onProgress: (percentage: number) => void
  ): Promise<void> {
    const config = getBunnyCDNConfig();
    return new Promise((resolve, reject) => {
      const upload = new Upload(file as never, {
        endpoint: `${config.apiUrl}/tusupload`,
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
        headers: {
          AuthorizationSignature: auth.shaAttempt,
          AuthorizationExpire: String(auth.authorizationExpire),
          VideoId: auth.video_id,
          LibraryId: String(auth.libraryId),
        },
        metadata: {
          filetype: file.mimeType ?? "video/mp4",
        },
        onError: reject,
        onProgress: (bytesUploaded, bytesTotal) => {
          onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
        },
        onSuccess: () => resolve(),
      });

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
  },

  /**
   * Save video record to MongoDB after upload completes.
   *
   * STUB — backend endpoint POST /videos/save not yet implemented.
   * This will be wired up when the backend deploys that endpoint.
   */
  async saveVideoRecord(
    data: VideoUploadFormData & { videoId: string }
  ): Promise<void> {
    logger.warn(
      "⚠️ saveVideoRecord: backend endpoint not yet available. Video metadata not persisted.",
      data.videoId
    );
    // TODO: wire up when backend adds POST /videos/save
  },
};
