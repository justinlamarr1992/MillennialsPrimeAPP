import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import HomePage from '../HomePage';
import { useBunnyCDNVideos } from '@/hooks/useBunnyCDNVideos';

// Mock useBunnyCDNVideos hook
jest.mock('@/hooks/useBunnyCDNVideos');

const mockUseBunnyCDNVideos = useBunnyCDNVideos as jest.MockedFunction<typeof useBunnyCDNVideos>;

describe('HomePage', () => {
  const mockVideoData = [
    {
      title: 'Breaking News Video',
      description: 'Important update for all members',
      guid: 'test-guid-123',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-15T10:00:00Z',
    },
    {
      title: 'Episode 2',
      description: 'Description 2',
      guid: 'test-guid-456',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-16T10:00:00Z',
    },
    {
      title: 'Episode 3',
      description: 'Description 3',
      guid: 'test-guid-789',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-17T10:00:00Z',
    },
    {
      title: 'Episode 4',
      description: 'Description 4',
      guid: 'test-guid-101',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-18T10:00:00Z',
    },
    {
      title: 'Episode 5',
      description: 'Description 5',
      guid: 'test-guid-102',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-19T10:00:00Z',
    },
    {
      title: 'Episode 6',
      description: 'Description 6',
      guid: 'test-guid-103',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-20T10:00:00Z',
    },
    {
      title: 'Episode 7',
      description: 'Description 7',
      guid: 'test-guid-104',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-21T10:00:00Z',
    },
    {
      title: 'Episode 8',
      description: 'Description 8',
      guid: 'test-guid-105',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-22T10:00:00Z',
    },
    {
      title: 'Episode 9',
      description: 'Description 9',
      guid: 'test-guid-106',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-23T10:00:00Z',
    },
    {
      title: 'Episode 10',
      description: 'Description 10',
      guid: 'test-guid-107',
      videoLibraryId: '147838',
      dateUploaded: '2025-01-24T10:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading indicator when fetching data', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Loading latest content...')).toBeTruthy();
    });
  });

  describe('Success State', () => {
    it('should display video content when data loads successfully', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: mockVideoData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Breaking News Video')).toBeTruthy();
      expect(screen.getByText('Important update for all members')).toBeTruthy();
    });

    it('should display admin name', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: mockVideoData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Millennials Prime Admin')).toBeTruthy();
    });

    it('should display countdown ad', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: mockVideoData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('First Update')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should display error message when data fetch fails', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Failed to load content. Please try again later.')).toBeTruthy();
    });

    it('should display custom error message when available', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Unable to load videos from server'),
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Unable to load videos from server')).toBeTruthy();
    });

    it('should display retry button when error occurs', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Retry')).toBeTruthy();
    });

    it('should call refetch when retry button is pressed', () => {
      const mockRefetch = jest.fn();
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      const retryButton = screen.getByText('Retry');
      fireEvent.press(retryButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty State', () => {
    it('should display no content message when data is null', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('No content available at this time.')).toBeTruthy();
    });

    it('should display no content message when data is undefined', () => {
      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('No content available at this time.')).toBeTruthy();
    });
  });

  describe('Data Variations', () => {
    it('should handle different video titles', () => {
      const customData = [...mockVideoData];
      customData[0] = { ...customData[0], title: 'Special Announcement' };

      mockUseBunnyCDNVideos.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Special Announcement')).toBeTruthy();
    });

    it('should handle different video descriptions', () => {
      const customData = [...mockVideoData];
      customData[0] = { ...customData[0], description: 'New feature release' };

      mockUseBunnyCDNVideos.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('New feature release')).toBeTruthy();
    });

    it('should handle different upload dates', () => {
      const customData = [...mockVideoData];
      customData[0] = { ...customData[0], dateUploaded: '2025-12-31T23:59:59Z' };

      mockUseBunnyCDNVideos.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      render(<HomePage />);

      expect(screen.getByText('Breaking News Video')).toBeTruthy();
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to success', async () => {
      const { rerender } = render(<HomePage />);

      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      rerender(<HomePage />);
      expect(screen.getByText('Loading latest content...')).toBeTruthy();

      mockUseBunnyCDNVideos.mockReturnValue({
        data: mockVideoData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      rerender(<HomePage />);
      expect(screen.getByText('Breaking News Video')).toBeTruthy();
    });

    it('should transition from loading to error', () => {
      const { rerender } = render(<HomePage />);

      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      rerender(<HomePage />);
      expect(screen.getByText('Loading latest content...')).toBeTruthy();

      mockUseBunnyCDNVideos.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch'),
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useBunnyCDNVideos>);

      rerender(<HomePage />);
      expect(screen.getByText('Failed to load content. Please try again later.')).toBeTruthy();
    });
  });
});
