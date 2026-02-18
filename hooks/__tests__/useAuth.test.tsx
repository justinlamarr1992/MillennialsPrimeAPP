/**
 * Tests for useAuth hook
 * Target Coverage: 90%
 */

import { renderHook } from '@testing-library/react-native';
import useAuth from '../useAuth';
import { AuthContext } from '@/context/AuthContext';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React from 'react';

describe('useAuth hook', () => {
  describe('when used within AuthProvider', () => {
    it('should return auth context values', () => {
      const mockContextValue = {
        user: { uid: 'test-123', email: 'test@example.com' } as unknown as FirebaseAuthTypes.User,
        loading: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(AuthContext.Provider, { value: mockContextValue }, children);
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.user).toEqual({ uid: 'test-123', email: 'test@example.com' });
      expect(result.current.loading).toBe(false);
    });

    it('should return loading state when loading', () => {
      const mockContextValue = {
        user: null,
        loading: true,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(AuthContext.Provider, { value: mockContextValue }, children);
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
    });

    it('should return null user when not authenticated', () => {
      const mockContextValue = {
        user: null,
        loading: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(AuthContext.Provider, { value: mockContextValue }, children);
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('when used outside AuthProvider', () => {
    it('should throw error when context is undefined', () => {
      // Suppress console.error for this test since we expect an error
      const consoleError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      // Restore console.error
      console.error = consoleError;
    });

    it('should throw error with correct message', () => {
      const consoleError = console.error;
      console.error = jest.fn();

      try {
        renderHook(() => useAuth());
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('useAuth must be used within an AuthProvider');
      }

      console.error = consoleError;
    });
  });

  describe('context updates', () => {
    it('should reflect user changes in context', () => {
      const initialContextValue = {
        user: null,
        loading: true,
      };

      const updatedContextValue = {
        user: { uid: 'new-user', email: 'new@example.com' } as unknown as FirebaseAuthTypes.User,
        loading: false,
      };

      let contextValue: typeof initialContextValue | typeof updatedContextValue = initialContextValue;

      const wrapper = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(AuthContext.Provider, { value: contextValue }, children);
      };

      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      // Initial state
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(true);

      // Update context
      contextValue = updatedContextValue;
      rerender({});

      // Updated state
      expect(result.current.user).toEqual({ uid: 'new-user', email: 'new@example.com' });
      expect(result.current.loading).toBe(false);
    });
  });
});
