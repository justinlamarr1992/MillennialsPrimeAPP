/**
 * Tests for useBunnyCDNVideos hook
 * Target Coverage: 85%
 *
 * Following functional programming and clean code principles
 * Testing pure functions and hook behavior
 */

import { useBunnyCDNVideos, useBunnyCDNSingleVideo } from '../useBunnyCDNVideos';
import { logger } from '@/utils/logger';

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Mock React Query since we can't test it easily without full React setup
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn((options) => {
    // Return a mock query result
    return {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    };
  }),
}));

describe('useBunnyCDNVideos hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up environment variables
    process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY = 'test-access-key';
    process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID = 'test-library-id';
    process.env.EXPO_PUBLIC_BUNNYCDN_API_URL = 'https://api.bunnycdn.com';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('hook behavior', () => {
    it('should export useBunnyCDNVideos function', () => {
      expect(typeof useBunnyCDNVideos).toBe('function');
    });

    it('should call useQuery with correct configuration', () => {
      const { useQuery } = require('@tanstack/react-query');

      useBunnyCDNVideos();

      expect(useQuery).toHaveBeenCalledWith({
        queryKey: ['bunnyCDNVideos'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        retry: 2,
      });
    });
  });

  describe('fetchBunnyCDNVideos function (via queryFn)', () => {
    let fetchBunnyCDNVideos: () => Promise<any>;

    beforeEach(() => {
      // Extract the queryFn from the useQuery call
      const { useQuery } = require('@tanstack/react-query');
      useBunnyCDNVideos();
      const queryOptions = (useQuery as jest.Mock).mock.calls[0][0];
      fetchBunnyCDNVideos = queryOptions.queryFn;
    });

    describe('successful data fetching', () => {
      it('should fetch and return array of video data', async () => {
        const mockVideoData = {
          items: [
            {
              title: 'Test Video 1',
              guid: 'video-123',
              dateUploaded: '2025-11-05T00:00:00Z',
              videoLibraryId: 'lib-123',
              metaTags: [{ value: 'Test description 1' }],
            },
            {
              title: 'Test Video 2',
              guid: 'video-456',
              dateUploaded: '2025-11-06T00:00:00Z',
              videoLibraryId: 'lib-456',
              metaTags: [{ value: 'Test description 2' }],
            },
          ],
          totalItems: 2,
          currentPage: 1,
          itemsPerPage: 10,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockVideoData,
        });

        const result = await fetchBunnyCDNVideos();

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          title: 'Test Video 1',
          description: 'Test description 1',
          guid: 'video-123',
          dateUploaded: '2025-11-05T00:00:00Z',
          videoLibraryId: 'lib-123',
        });
        expect(result[1]).toEqual({
          title: 'Test Video 2',
          description: 'Test description 2',
          guid: 'video-456',
          dateUploaded: '2025-11-06T00:00:00Z',
          videoLibraryId: 'lib-456',
        });
      });

      it('should handle video without metaTags', async () => {
        const mockVideoData = {
          items: [
            {
              title: 'Video Without Description',
              guid: 'video-456',
              dateUploaded: '2025-11-05T00:00:00Z',
              videoLibraryId: 'lib-456',
            },
          ],
          totalItems: 1,
          currentPage: 1,
          itemsPerPage: 2,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockVideoData,
        });

        const result = await fetchBunnyCDNVideos();

        expect(result?.description).toBe('');
      });

      it('should handle empty metaTags array', async () => {
        const mockVideoData = {
          items: [
            {
              title: 'Video With Empty MetaTags',
              guid: 'video-789',
              dateUploaded: '2025-11-05T00:00:00Z',
              videoLibraryId: 'lib-789',
              metaTags: [],
            },
          ],
          totalItems: 1,
          currentPage: 1,
          itemsPerPage: 2,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockVideoData,
        });

        const result = await fetchBunnyCDNVideos();

        expect(result?.description).toBe('');
      });

      it('should return empty array when items array is empty', async () => {
        const mockVideoData = {
          items: [],
          totalItems: 0,
          currentPage: 1,
          itemsPerPage: 10,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockVideoData,
        });

        const result = await fetchBunnyCDNVideos();

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
      });
    });

    describe('error handling', () => {
      it('should throw error for missing EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY', async () => {
        delete process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY;

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Unable to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY')
        );
      });

      it('should throw error for missing EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID', async () => {
        delete process.env.EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID;

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Unable to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID')
        );
      });

      it('should throw error for missing EXPO_PUBLIC_BUNNYCDN_API_URL', async () => {
        delete process.env.EXPO_PUBLIC_BUNNYCDN_API_URL;

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Unable to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('EXPO_PUBLIC_BUNNYCDN_API_URL')
        );
      });

      it('should throw error for empty string environment variables', async () => {
        process.env.EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY = '   ';

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Unable to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          expect.stringContaining('Missing or empty BunnyCDN environment variables')
        );
      });

      it('should handle API error response', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        });

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Failed to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          'BunnyCDN API error: status=500, statusText=Internal Server Error'
        );
      });

      it('should handle 404 error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });

        await expect(fetchBunnyCDNVideos()).rejects.toThrow(
          'Failed to load videos. Please try again later.'
        );

        expect(logger.error).toHaveBeenCalledWith(
          'BunnyCDN API error: status=404, statusText=Not Found'
        );
      });

      it('should handle network error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(
          new Error('Network request failed')
        );

        await expect(fetchBunnyCDNVideos()).rejects.toThrow('Network request failed');
      });
    });

    describe('fetch parameters', () => {
      it('should call fetch with correct URL and headers', async () => {
        const mockVideoData = {
          items: [],
          totalItems: 0,
          currentPage: 1,
          itemsPerPage: 2,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockVideoData,
        });

        await fetchBunnyCDNVideos();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.bunnycdn.com/library/test-library-id/videos?page=1&itemsPerPage=10&orderBy=date',
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              AccessKey: 'test-access-key',
            },
          }
        );
      });
    });
  });

  describe('useBunnyCDNSingleVideo hook', () => {
    beforeEach(() => {
      // Mock useQuery to simulate different states
      const { useQuery } = require('@tanstack/react-query');
      useQuery.mockImplementation(() => {
        // Simulate successful query with multiple videos
        return {
          data: [
            {
              title: 'First Video',
              description: 'First Description',
              guid: 'guid-1',
              dateUploaded: '2024-01-15T10:00:00Z',
              videoLibraryId: 'library-1',
            },
            {
              title: 'Second Video',
              description: 'Second Description',
              guid: 'guid-2',
              dateUploaded: '2024-01-16T10:00:00Z',
              videoLibraryId: 'library-2',
            },
          ],
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: null,
          refetch: jest.fn(),
        };
      });
    });

    it('should return first video from array', () => {
      const result = useBunnyCDNSingleVideo();

      expect(result.data).toEqual({
        title: 'First Video',
        description: 'First Description',
        guid: 'guid-1',
        dateUploaded: '2024-01-15T10:00:00Z',
        videoLibraryId: 'library-1',
      });
    });

    it('should return null when no videos available', () => {
      const { useQuery } = require('@tanstack/react-query');
      useQuery.mockImplementation(() => ({
        data: [],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      }));

      const result = useBunnyCDNSingleVideo();

      expect(result.data).toBeNull();
    });

    it('should return null when data is undefined', () => {
      const { useQuery } = require('@tanstack/react-query');
      useQuery.mockImplementation(() => ({
        data: undefined,
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      }));

      const result = useBunnyCDNSingleVideo();

      expect(result.data).toBeNull();
    });

    it('should maintain other query properties', () => {
      const mockRefetch = jest.fn();
      const { useQuery } = require('@tanstack/react-query');
      useQuery.mockImplementation(() => ({
        data: [{ title: 'Test' }],
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        refetch: mockRefetch,
      }));

      const result = useBunnyCDNSingleVideo();

      expect(result.isLoading).toBe(false);
      expect(result.isSuccess).toBe(true);
      expect(result.isError).toBe(false);
      expect(result.refetch).toBe(mockRefetch);
    });
  });
});
