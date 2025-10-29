import { useQuery } from "@tanstack/react-query";
import { logger } from "@/utils/logger";

// Define interface for BunnyCDN video item structure
interface VideoItem {
  title: string;
  guid: string;
  dateUploaded: string;
  videoLibraryId: string;
  metaTags?: Array<{ value?: string }>;
}

interface BunnyCDNResponse {
  items: VideoItem[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

interface VideoData {
  title: string;
  description: string;
  guid: string;
  dateUploaded: string;
  videoLibraryId: string;
}

/**
 * Helper function to safely extract description from video metadata
 */
const getVideoDescription = (item: VideoItem): string => {
  if (item?.metaTags && Array.isArray(item.metaTags) && item.metaTags.length > 0) {
    return item.metaTags[0]?.value || "";
  }
  return "";
};

/**
 * Fetches videos from BunnyCDN API
 */
const fetchBunnyCDNVideos = async (): Promise<VideoData | null> => {
  const accessKey = process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;
  const libraryId = process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;
  const apiUrl = process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;

  // Validate environment variables and provide specific error messages
  const missingVars: string[] = [];
  if (!accessKey?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY");
  if (!libraryId?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID");
  if (!apiUrl?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_API_URL");

  if (missingVars.length > 0) {
    logger.error(
      `Missing or empty BunnyCDN environment variables: ${missingVars.join(", ")}`
    );
    // User-friendly message doesn't expose configuration details
    throw new Error("Unable to load videos. Please try again later.");
  }

  // TypeScript assertion: we've validated these exist above
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: accessKey as string,
    },
  };

  const response = await fetch(
    `${apiUrl}/library/${libraryId}/videos?page=1&itemsPerPage=2&orderBy=date`,
    options
  );

  if (!response.ok) {
    throw new Error(`BunnyCDN API error: ${response.status}`);
  }

  const data: BunnyCDNResponse = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  const firstVideo = data.items[0];

  return {
    title: firstVideo.title,
    description: getVideoDescription(firstVideo),
    guid: firstVideo.guid,
    dateUploaded: firstVideo.dateUploaded,
    videoLibraryId: firstVideo.videoLibraryId,
  };
};

/**
 * Custom hook to fetch and cache BunnyCDN videos using React Query
 *
 * Features:
 * - Automatic caching (5 minute stale time)
 * - Loading and error states
 * - Retry logic on failure
 * - Prevents unnecessary refetches
 *
 * @returns Query result with video data, loading state, and error state
 */
export const useBunnyCDNVideos = () => {
  return useQuery({
    queryKey: ["bunnyCDNVideos"],
    queryFn: fetchBunnyCDNVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
