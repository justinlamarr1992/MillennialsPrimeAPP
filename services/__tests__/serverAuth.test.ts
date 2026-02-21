/**
 * Tests for serverAuth service with SecureStore
 * Following TDD approach - tests written first
 */

// Mock dependencies BEFORE imports
jest.mock('expo-secure-store');
jest.mock('@/API/axios');
jest.mock('@/utils/logger');

import { serverAuth } from '../serverAuth';
import * as SecureStore from 'expo-secure-store';
import axios, { axiosPrivate } from '@/API/axios';

describe('serverAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginToServer', () => {
    it('sends password field (not pwd) to match backend contract', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'token', _id: 'id', roles: { User: 2001 } }
      });

      await serverAuth.loginToServer('test@example.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith('/auth', {
        user: 'test@example.com',
        password: 'password123',
      }, { headers: { 'Content-Type': 'application/json' } });
    });

    it('stores access token and user ID on successful login', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'mock-access-token-123', _id: 'user-mongodb-id-456', roles: { User: 2001 } }
      });

      const result = await serverAuth.loginToServer('test@example.com', 'password123');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_access_token', 'mock-access-token-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_user_id', 'user-mongodb-id-456');
      expect(result).toEqual({ accessToken: 'mock-access-token-123', _id: 'user-mongodb-id-456', roles: { User: 2001 } });
    });

    it('stores refresh token in SecureStore when provided in response', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'token', _id: 'id', roles: { User: 2001 }, refreshToken: 'mock-refresh-token-abc' }
      });

      await serverAuth.loginToServer('test@example.com', 'password123');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_refresh_token', 'mock-refresh-token-abc');
    });

    it('does not store refresh token when not in response', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'token', _id: 'id', roles: { User: 2001 } }
      });

      await serverAuth.loginToServer('test@example.com', 'password123');

      const calls = (SecureStore.setItemAsync as jest.Mock).mock.calls;
      const refreshCalls = calls.filter(([key]: [string]) => key === 'server_refresh_token');
      expect(refreshCalls).toHaveLength(0);
    });

    it('throws error on failed login', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'));
      await expect(serverAuth.loginToServer('test@example.com', 'wrongpassword')).rejects.toThrow('Unauthorized');
    });

    it('handles server error responses', async () => {
      const mockError = { response: { status: 401, data: { message: 'Invalid credentials' } } };
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);
      await expect(serverAuth.loginToServer('test@example.com', 'wrongpassword')).rejects.toMatchObject(mockError);
    });
  });

  describe('registerOnServer', () => {
    it('sends password field (not pwd) to match backend contract', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await serverAuth.registerOnServer({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        DOB: '1990-01-01'
      });

      expect(axios.post).toHaveBeenCalledWith('/register', {
        user: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        DOB: '1990-01-01'
      }, { headers: { 'Content-Type': 'application/json' } });
    });

    it('successfully registers with minimal required fields', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await serverAuth.registerOnServer({ email: 'newuser@example.com', password: 'SecurePass123!' });

      expect(axios.post).toHaveBeenCalledWith('/register', {
        user: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: undefined,
        lastName: undefined,
        DOB: undefined
      }, { headers: { 'Content-Type': 'application/json' } });
    });

    it('throws error when registration fails', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Email already exists'));
      await expect(serverAuth.registerOnServer({ email: 'existing@example.com', password: 'password123' })).rejects.toThrow('Email already exists');
    });
  });

  describe('getAccessToken', () => {
    it('retrieves stored access token from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-token-abc');
      expect(await serverAuth.getAccessToken()).toBe('stored-token-abc');
    });

    it('returns null when no token stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      expect(await serverAuth.getAccessToken()).toBeNull();
    });

    it('returns null on SecureStore error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      expect(await serverAuth.getAccessToken()).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('retrieves stored user ID from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('user-id-789');
      expect(await serverAuth.getUserId()).toBe('user-id-789');
    });

    it('returns null when no user ID stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      expect(await serverAuth.getUserId()).toBeNull();
    });

    it('returns null on SecureStore error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      expect(await serverAuth.getUserId()).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears access token, user ID, and refresh token from SecureStore', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await serverAuth.logout();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_access_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_user_id');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_refresh_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });

    it('does not throw on SecureStore error', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
      await expect(serverAuth.logout()).resolves.toBeUndefined();
    });
  });

  describe('refreshToken', () => {
    it('reads stored refresh token and sends it in request body', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-refresh-token');
      (axiosPrivate.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'new-token', _id: 'id', refreshToken: 'new-rt' }
      });

      await serverAuth.refreshToken();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('server_refresh_token');
      expect(axiosPrivate.post).toHaveBeenCalledWith('/refresh', { refreshToken: 'stored-refresh-token' });
    });

    it('stores new access token, user ID, and refresh token after successful refresh', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-refresh-token');
      (axiosPrivate.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'new-refreshed-token-xyz', _id: 'user-id-789', refreshToken: 'new-refresh-token-abc' }
      });

      const newToken = await serverAuth.refreshToken();

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_access_token', 'new-refreshed-token-xyz');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_user_id', 'user-id-789');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_refresh_token', 'new-refresh-token-abc');
      expect(newToken).toBe('new-refreshed-token-xyz');
    });

    it('uses axiosPrivate (not the default axios instance)', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-refresh-token');
      (axiosPrivate.post as jest.Mock).mockResolvedValueOnce({
        data: { accessToken: 'token', _id: 'id', refreshToken: 'rt' }
      });

      await serverAuth.refreshToken();

      expect(axios.post).not.toHaveBeenCalled();
    });

    it('throws error when refresh fails', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-refresh-token');
      (axiosPrivate.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh token expired'));

      await expect(serverAuth.refreshToken()).rejects.toThrow('Refresh token expired');
    });
  });

  describe('hasValidCredentials', () => {
    it('returns true when both token and user ID exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('token-123').mockResolvedValueOnce('user-456');
      expect(await serverAuth.hasValidCredentials()).toBe(true);
    });

    it('returns false when token is missing', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce('user-456');
      expect(await serverAuth.hasValidCredentials()).toBe(false);
    });

    it('returns false when user ID is missing', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('token-123').mockResolvedValueOnce(null);
      expect(await serverAuth.hasValidCredentials()).toBe(false);
    });

    it('returns false when both are missing', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      expect(await serverAuth.hasValidCredentials()).toBe(false);
    });
  });
});
