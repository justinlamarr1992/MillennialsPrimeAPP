import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import ErrorBoundary from '../ErrorBoundary';
import { Text } from 'react-native';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No Error</Text>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('Normal Rendering', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <Text>Test Content</Text>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should render multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <Text>Child 1</Text>
          <Text>Child 2</Text>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeTruthy();
      expect(screen.getByText('Child 2')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors from child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should display fallback UI instead of crashing
      expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
    });

    it('should display user-friendly error message when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/We apologize for the inconvenience/)).toBeTruthy();
    });

    it('should display fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error fallback
      expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
      expect(screen.queryByText('No Error')).toBeNull();
    });
  });

  describe('Try Again Functionality', () => {
    it('should display "Try Again" button when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    it('should handle "Try Again" button press without errors', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try Again');

      // Should not throw when pressed
      expect(() => fireEvent.press(tryAgainButton)).not.toThrow();
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback UI when provided', () => {
      const CustomFallback = <Text>Custom Error Message</Text>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error Message')).toBeTruthy();
    });

    it('should not show default fallback when custom fallback is provided', () => {
      const CustomFallback = <Text>Custom Error</Text>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Oops! Something went wrong')).toBeNull();
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorMock = jest.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // onError should have been called
      expect(onErrorMock).toHaveBeenCalled();
    });

    it('should pass error and errorInfo to onError callback', () => {
      const onErrorMock = jest.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Development vs Production', () => {
    it('should show error details in development mode', () => {
      // __DEV__ is mocked as true in test setup
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error details should be visible in dev mode
      expect(screen.getByText(/Error Details \(Dev Only\)/)).toBeTruthy();
      expect(screen.getByText(/Test error/)).toBeTruthy();
    });
  });

  describe('Nested Error Boundaries', () => {
    it('should handle errors in nested boundaries', () => {
      render(
        <ErrorBoundary fallback={<Text>Outer Error</Text>}>
          <ErrorBoundary fallback={<Text>Inner Error</Text>}>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText('Inner Error')).toBeTruthy();
      expect(screen.queryByText('Outer Error')).toBeNull();
    });
  });

  describe('Component Stability', () => {
    it('should not crash the entire app when child errors occur', () => {
      // This test verifies the boundary catches errors gracefully
      expect(() => {
        render(
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        );
      }).not.toThrow();
    });

    it('should display error state correctly', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error UI is shown
      expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });
  });
});
