/**
 * Tests for useThemeColor hook
 * Target Coverage: 90%
 */

import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../useThemeColor';
import { useColorScheme } from 'react-native';

// Mock react-native's useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useThemeColor hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('light theme', () => {
    beforeEach(() => {
      mockedUseColorScheme.mockReturnValue('light');
    });

    it('should return light theme color from COLORS when no props provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'background')
      );

      expect(result.current).toBe('#F7F7F7'); // COLORS.light.background
    });

    it('should return prop value when light prop is provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'background')
      );

      expect(result.current).toBe('#custom-light');
    });

    it('should return default color when prop is not provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({ dark: '#custom-dark' }, 'text')
      );

      expect(result.current).toBe('#000000'); // COLORS.light.text
    });

    it('should handle text color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      expect(result.current).toBe('#000000');
    });

    it('should handle priC color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'priC')
      );

      expect(result.current).toBe('#611821');
    });

    it('should handle secC color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'secC')
      );

      expect(result.current).toBe('#8e202b');
    });
  });

  describe('dark theme', () => {
    beforeEach(() => {
      mockedUseColorScheme.mockReturnValue('dark');
    });

    it('should return dark theme color from COLORS when no props provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'background')
      );

      expect(result.current).toBe('#000000'); // COLORS.dark.background
    });

    it('should return prop value when dark prop is provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'background')
      );

      expect(result.current).toBe('#custom-dark');
    });

    it('should return default color when prop is not provided', () => {
      const { result } = renderHook(() =>
        useThemeColor({ light: '#custom-light' }, 'text')
      );

      expect(result.current).toBe('#ffffff'); // COLORS.dark.text
    });

    it('should handle text color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      expect(result.current).toBe('#ffffff');
    });

    it('should handle white color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'white')
      );

      expect(result.current).toBe('#FFFFFF');
    });

    it('should handle gray color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'gray')
      );

      expect(result.current).toBe('white');
    });
  });

  describe('null/undefined theme', () => {
    it('should default to light theme when useColorScheme returns null', () => {
      mockedUseColorScheme.mockReturnValue(null);

      const { result } = renderHook(() =>
        useThemeColor({}, 'background')
      );

      expect(result.current).toBe('#F7F7F7'); // COLORS.light.background (default)
    });

    it('should default to light theme when useColorScheme returns undefined', () => {
      mockedUseColorScheme.mockReturnValue(undefined);

      const { result } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      expect(result.current).toBe('#000000'); // COLORS.light.text (default)
    });
  });

  describe('prop priority', () => {
    it('should prioritize light prop over default light theme color', () => {
      mockedUseColorScheme.mockReturnValue('light');

      const { result } = renderHook(() =>
        useThemeColor({ light: '#override' }, 'background')
      );

      expect(result.current).toBe('#override');
    });

    it('should prioritize dark prop over default dark theme color', () => {
      mockedUseColorScheme.mockReturnValue('dark');

      const { result } = renderHook(() =>
        useThemeColor({ dark: '#override' }, 'background')
      );

      expect(result.current).toBe('#override');
    });

    it('should use default when prop for opposite theme is provided', () => {
      mockedUseColorScheme.mockReturnValue('light');

      const { result } = renderHook(() =>
        useThemeColor({ dark: '#dark-override' }, 'background')
      );

      // Should use default light color since light prop not provided
      expect(result.current).toBe('#F7F7F7');
    });
  });

  describe('various color names', () => {
    beforeEach(() => {
      mockedUseColorScheme.mockReturnValue('light');
    });

    it('should handle loadingButton color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'loadingButton')
      );

      expect(result.current).toBe('#611821');
    });

    it('should handle plcHoldText color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'plcHoldText')
      );

      expect(result.current).toBe('#BABBBD');
    });

    it('should handle actTab color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'actTab')
      );

      expect(result.current).toBe('#BD2932');
    });

    it('should handle primeDefaultText color', () => {
      const { result } = renderHook(() =>
        useThemeColor({}, 'primeDefaultText')
      );

      expect(result.current).toBe('#ffffff');
    });
  });

  describe('theme switching', () => {
    it('should update color when theme changes from light to dark', () => {
      mockedUseColorScheme.mockReturnValue('light');

      const { result, rerender } = renderHook(() =>
        useThemeColor({}, 'text')
      );

      // Initial: light theme
      expect(result.current).toBe('#000000');

      // Switch to dark theme
      mockedUseColorScheme.mockReturnValue('dark');
      rerender();

      // Should now return dark theme color
      expect(result.current).toBe('#ffffff');
    });

    it('should update color when theme changes from dark to light', () => {
      mockedUseColorScheme.mockReturnValue('dark');

      const { result, rerender } = renderHook(() =>
        useThemeColor({}, 'gray')
      );

      // Initial: dark theme
      expect(result.current).toBe('white');

      // Switch to light theme
      mockedUseColorScheme.mockReturnValue('light');
      rerender();

      // Should now return light theme color
      expect(result.current).toBe('gray');
    });

    it('should respect custom props even after theme change', () => {
      mockedUseColorScheme.mockReturnValue('light');

      const { result, rerender } = renderHook(() =>
        useThemeColor({ light: '#custom-light', dark: '#custom-dark' }, 'text')
      );

      // Light theme with custom color
      expect(result.current).toBe('#custom-light');

      // Switch to dark theme
      mockedUseColorScheme.mockReturnValue('dark');
      rerender();

      // Should use custom dark color
      expect(result.current).toBe('#custom-dark');
    });
  });
});
