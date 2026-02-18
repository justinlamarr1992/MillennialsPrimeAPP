/**
 * Hook for managing the video upload workflow
 *
 * Orchestrates:
 * 1. File selection via expo-image-picker
 * 2. BunnyCDN video slot creation
 * 3. TUS authorization from backend
 * 4. TUS resumable upload with progress tracking
 * 5. Metadata update and record save after completion
 *
 * Phase machine: idle → authorizing → uploading → complete | error
 */

import { useState, useCallback } from "react";
import { videoUploadService } from "@/services/videoUploadService";
import { logger } from "@/utils/logger";
import useAxiosPrivate from "./useAxiosPrivate";
import type { ImagePickerAsset, ImagePickerResult } from "expo-image-picker";
import type { UploadPhase, VideoUploadFormData } from "@/types/videoUpload";

interface UseVideoUploadResult {
  phase: UploadPhase;
  progress: number;
  error: string | null;
  selectedFile: ImagePickerAsset | null;
  handleVideoSelect: (result: ImagePickerResult) => void;
  submitUpload: (form: VideoUploadFormData) => Promise<void>;
  reset: () => void;
}

export const useVideoUpload = (): UseVideoUploadResult => {
  useAxiosPrivate(); // Set up JWT interceptors for backend calls

  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ImagePickerAsset | null>(
    null
  );

  const handleVideoSelect = useCallback((result: ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedFile(result.assets[0]);
    }
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setProgress(0);
    setError(null);
    setSelectedFile(null);
  }, []);

  const submitUpload = useCallback(
    async (form: VideoUploadFormData): Promise<void> => {
      if (!form.title.trim()) {
        setPhase("error");
        setError("Please enter a title for your video.");
        return;
      }
      if (!form.description.trim()) {
        setPhase("error");
        setError("Please enter a description for your video.");
        return;
      }
      if (!form.category.trim()) {
        setPhase("error");
        setError("Please select a category for your video.");
        return;
      }
      if (!selectedFile) {
        setPhase("error");
        setError("Please select a video file to upload.");
        return;
      }

      try {
        setPhase("authorizing");
        setError(null);
        setProgress(0);

        logger.log("📹 Starting video upload for:", form.title);

        const { guid } = await videoUploadService.createBunnyCDNVideo(
          form.title
        );
        const auth = await videoUploadService.getUploadAuth(guid, form.title);

        setPhase("uploading");

        await videoUploadService.performTusUpload(
          selectedFile,
          auth,
          setProgress
        );

        await videoUploadService.updateBunnyCDNMetadata(guid, form.title);
        await videoUploadService.saveVideoRecord({ ...form, videoId: guid });

        setPhase("complete");
        logger.log("✅ Video upload complete:", guid);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Please try again.";
        setPhase("error");
        setError(message);
        logger.error("❌ Video upload failed:", err);
      }
    },
    [selectedFile]
  );

  return { phase, progress, error, selectedFile, handleVideoSelect, submitUpload, reset };
};
