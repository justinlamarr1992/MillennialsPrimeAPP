/**
 * Tests for useBunnyCDNVideos hook
 * Target Coverage: 85%
 *
 * Note: This hook is a thin wrapper around React Query's useQuery.
 * We test the actual business logic (fetchBunnyCDNVideos function) which the hook uses.
 * Testing the useQuery wrapper itself would test library behavior, not our code.
 */

import { useBunnyCDNVideos } from '../useBunnyCDNVideos';
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
      it('should fetch and return video data', async () => {
        const mockVideoData = {
          items: [
            {
              title: 'Test Video',
              guid: 'video-123',
              dateUploaded: '2025-11-05T00:00:00Z',
              videoLibraryId: 'lib-123',
              metaTags: [{ value: 'Test description' }],
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

        expect(result).toEqual({
          title: 'Test Video',
          description: 'Test description',
          guid: 'video-123',
          dateUploaded: '2025-11-05T00:00:00Z',
          videoLibraryId: 'lib-123',
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

      it('should return null when items array is empty', async () => {
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

        const result = await fetchBunnyCDNVideos();

        expect(result).toBeNull();
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
          'https://api.bunnycdn.com/library/test-library-id/videos?page=1&itemsPerPage=2&orderBy=date',
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
});
