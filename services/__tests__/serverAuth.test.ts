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
    it('stores access token and user ID on successful login', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token-123',
          _id: 'user-mongodb-id-456',
          roles: { User: 2001 }
        }
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await serverAuth.loginToServer('test@example.com', 'password123');

      // Verify axios called with correct params
      expect(axios.post).toHaveBeenCalledWith('/auth', {
        user: 'test@example.com',
        pwd: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Verify tokens stored in SecureStore (encrypted storage)
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'server_access_token',
        'mock-access-token-123'
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'server_user_id',
        'user-mongodb-id-456'
      );

      // Verify return value
      expect(result).toEqual({
        accessToken: 'mock-access-token-123',
        _id: 'user-mongodb-id-456',
        roles: { User: 2001 }
      });
    });

    it('throws error on failed login', async () => {
      const mockError = new Error('Unauthorized');
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        serverAuth.loginToServer('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Unauthorized');
    });

    it('handles server error responses', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      };
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        serverAuth.loginToServer('test@example.com', 'wrongpassword')
      ).rejects.toMatchObject(mockError);
    });
  });

  describe('registerOnServer', () => {
    it('successfully registers new user with all fields', async () => {
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
        pwd: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        DOB: '1990-01-01'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('successfully registers with minimal required fields', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

      await serverAuth.registerOnServer({
        email: 'newuser@example.com',
        password: 'SecurePass123!'
      });

      expect(axios.post).toHaveBeenCalledWith('/register', {
        user: 'newuser@example.com',
        pwd: 'SecurePass123!',
        firstName: undefined,
        lastName: undefined,
        DOB: undefined
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('throws error when registration fails', async () => {
      const mockError = new Error('Email already exists');
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(
        serverAuth.registerOnServer({
          email: 'existing@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('getAccessToken', () => {
    it('retrieves stored access token from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-token-abc');

      const token = await serverAuth.getAccessToken();

      expect(token).toBe('stored-token-abc');
    });

    it('returns null when no token stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const token = await serverAuth.getAccessToken();

      expect(token).toBeNull();
    });

    it('returns null on SecureStore error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const token = await serverAuth.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('retrieves stored user ID from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('user-id-789');

      const userId = await serverAuth.getUserId();

      expect(userId).toBe('user-id-789');
    });

    it('returns null when no user ID stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const userId = await serverAuth.getUserId();

      expect(userId).toBeNull();
    });

    it('returns null on SecureStore error', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      const userId = await serverAuth.getUserId();

      expect(userId).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears both token and user ID from SecureStore', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await serverAuth.logout();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_access_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('server_user_id');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
    });

    it('does not throw on SecureStore error', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(serverAuth.logout()).resolves.toBeUndefined();
    });
  });

  describe('refreshToken', () => {
    it('uses axiosPrivate (withCredentials) so the refresh cookie is sent', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-refreshed-token-xyz',
          _id: 'user-id-789'
        }
      };

      (axiosPrivate.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const newToken = await serverAuth.refreshToken();

      expect(axiosPrivate.post).toHaveBeenCalledWith('/refresh');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'server_access_token',
        'new-refreshed-token-xyz'
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'server_user_id',
        'user-id-789'
      );
      expect(newToken).toBe('new-refreshed-token-xyz');
    });

    it('does not use the default axios instance (which lacks credentials)', async () => {
      const mockResponse = {
        data: { accessToken: 'token', _id: 'id' }
      };

      (axiosPrivate.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await serverAuth.refreshToken();

      expect(axios.post).not.toHaveBeenCalledWith('/refresh');
    });

    it('throws error when refresh fails', async () => {
      const mockError = new Error('Refresh token expired');
      (axiosPrivate.post as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(serverAuth.refreshToken()).rejects.toThrow('Refresh token expired');
    });
  });

  describe('hasValidCredentials', () => {
    it('returns true when both token and user ID exist', async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce('token-123') // getAccessToken call
        .mockResolvedValueOnce('user-456'); // getUserId call

      const hasCredentials = await serverAuth.hasValidCredentials();

      expect(hasCredentials).toBe(true);
    });

    it('returns false when token is missing', async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce(null) // no token
        .mockResolvedValueOnce('user-456'); // has user ID

      const hasCredentials = await serverAuth.hasValidCredentials();

      expect(hasCredentials).toBe(false);
    });

    it('returns false when user ID is missing', async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce('token-123') // has token
        .mockResolvedValueOnce(null); // no user ID

      const hasCredentials = await serverAuth.hasValidCredentials();

      expect(hasCredentials).toBe(false);
    });

    it('returns false when both are missing', async () => {
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce(null) // no token
        .mockResolvedValueOnce(null); // no user ID

      const hasCredentials = await serverAuth.hasValidCredentials();

      expect(hasCredentials).toBe(false);
    });
  });
});
