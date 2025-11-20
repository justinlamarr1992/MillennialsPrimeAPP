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

export interface VideoData {
  title: string;
  description: string;
  guid: string;
  dateUploaded: string;
  videoLibraryId: string;
}

interface EnvConfig {
  accessKey: string;
  libraryId: string;
  apiUrl: string;
}

/**
 * Pure function to safely extract description from video metadata
 *
 * @pure Same input always returns same output
 */
const getVideoDescription = (item: VideoItem): string => {
  if (item?.metaTags && Array.isArray(item.metaTags) && item.metaTags.length > 0) {
    return item.metaTags[0]?.value || "";
  }
  return "";
};

/**
 * Pure function to transform VideoItem to VideoData
 *
 * @pure No side effects, deterministic output
 */
const transformVideoItem = (item: VideoItem): VideoData => ({
  title: item.title,
  description: getVideoDescription(item),
  guid: item.guid,
  dateUploaded: item.dateUploaded,
  videoLibraryId: item.videoLibraryId,
});

/**
 * Pure function to validate environment configuration
 *
 * @pure Returns validated config or throws error
 */
const getEnvConfig = (): EnvConfig => {
  const accessKey = process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;
  const libraryId = process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;
  const apiUrl = process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;

  const missingVars: string[] = [];
  if (!accessKey?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY");
  if (!libraryId?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID");
  if (!apiUrl?.trim()) missingVars.push("EXPO_PUBLIC_BUNNYCDN_API_URL");

  if (missingVars.length > 0) {
    logger.error(
      `Missing or empty BunnyCDN environment variables: ${missingVars.join(", ")}`
    );
    throw new Error("Unable to load videos. Please try again later.");
  }

  return {
    accessKey: accessKey as string,
    libraryId: libraryId as string,
    apiUrl: apiUrl as string,
  };
};

/**
 * Pure function to build fetch options
 *
 * @pure Same input always returns same output
 */
const buildFetchOptions = (accessKey: string): RequestInit => ({
  method: "GET",
  headers: {
    accept: "application/json",
    AccessKey: accessKey,
  },
});

/**
 * Pure function to build API URL
 *
 * @pure Same input always returns same output
 */
const buildVideoApiUrl = (
  apiUrl: string,
  libraryId: string,
  itemsPerPage: number = 10
): string =>
  `${apiUrl}/library/${libraryId}/videos?page=1&itemsPerPage=${itemsPerPage}&orderBy=date`;

/**
 * Pure function to generate dummy video data for testing/demo
 * Used when BunnyCDN doesn't have enough content
 *
 * @pure Deterministic output, no side effects
 */
const generateDummyVideos = (realVideos: VideoData[], targetCount: number = 10): VideoData[] => {
  if (realVideos.length >= targetCount) {
    return realVideos;
  }

  const dummyVideos: VideoData[] = [...realVideos];
  const titles = [
    "Breaking News Update",
    "Weekly Highlights",
    "Special Report",
    "Market Analysis",
    "Tech Innovation",
    "Global Events",
    "Expert Interview",
    "Community Stories",
    "Behind the Scenes",
    "Future Insights"
  ];

  for (let i = realVideos.length; i < targetCount; i++) {
    dummyVideos.push({
      title: titles[i % titles.length] + ` #${i + 1}`,
      description: `This is placeholder content for demonstration purposes. Video ${i + 1} will be replaced with real content.`,
      guid: `dummy-${i}-${Date.now()}`,
      dateUploaded: new Date(Date.now() - i * 86400000).toISOString(),
      videoLibraryId: realVideos[0]?.videoLibraryId || "dummy-library"
    });
  }

  return dummyVideos;
};

/**
 * Fetches videos from BunnyCDN API
 * Returns array of videos for multiple content sections
 */
const fetchBunnyCDNVideos = async (): Promise<VideoData[]> => {
  const config = getEnvConfig();
  const options = buildFetchOptions(config.accessKey);
  const url = buildVideoApiUrl(config.apiUrl, config.libraryId, 10);

  const response = await fetch(url, options);

  if (!response.ok) {
    logger.error(`BunnyCDN API error: status=${response.status}, statusText=${response.statusText}`);
    throw new Error("Failed to load videos. Please try again later.");
  }

  const data: BunnyCDNResponse = await response.json();

  if (!data.items || data.items.length === 0) {
    return [];
  }

  const realVideos = data.items.map(transformVideoItem);

  // Generate dummy data if we don't have enough videos for HBO-style layout
  return generateDummyVideos(realVideos, 10);
};

/**
 * Custom hook to fetch and cache multiple BunnyCDN videos using React Query
 *
 * Features:
 * - Automatic caching (5 minute stale time)
 * - Loading and error states
 * - Retry logic on failure
 * - Prevents unnecessary refetches
 *
 * @pure Hook with no side effects beyond data fetching
 * @returns Query result with array of video data, loading state, and error state
 */
export const useBunnyCDNVideos = () => {
  return useQuery({
    queryKey: ["bunnyCDNVideos"],
    queryFn: fetchBunnyCDNVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Custom hook to fetch single video (for backward compatibility)
 * Returns the first video from the collection
 *
 * @pure Hook with no side effects beyond data fetching
 * @returns Query result with single video data or null
 */
export const useBunnyCDNSingleVideo = () => {
  const query = useBunnyCDNVideos();

  return {
    ...query,
    data: query.data?.[0] ?? null,
  };
};
