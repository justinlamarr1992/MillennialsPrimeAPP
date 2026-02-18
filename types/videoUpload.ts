export type UploadPhase =
  | "idle"
  | "authorizing"
  | "uploading"
  | "complete"
  | "error";

export interface VideoUploadFormData {
  title: string;
  description: string;
  category: string;
  audience: "millennials" | "primes";
}

export interface BunnyCreateResponse {
  guid: string;
  videoLibraryId: string;
}

export interface UploadAuthResponse {
  success: boolean;
  shaAttempt: string;
  authorizationExpire: number;
  video_id: string;
  libraryId: number;
}
