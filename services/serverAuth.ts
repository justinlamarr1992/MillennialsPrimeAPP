/**
 * Server Authentication Service
 * Handles authentication with the Express.js/MongoDB backend
 * Separate from Firebase Auth - manages JWT tokens for API access
 *
 * Security: Uses expo-secure-store for encrypted token storage (iOS Keychain/Android Keystore)
 */

import * as SecureStore from 'expo-secure-store';
import axios from '@/API/axios';
import { logger } from '@/utils/logger';

interface ServerAuthResponse {
  accessToken: string;
  _id: string;
  roles: {
    User?: number;
    Editor?: number;
    Admin?: number;
  };
}

interface RegisterUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  DOB?: string;
}

// SecureStore keys (without @ symbol - SecureStore only allows alphanumeric, ".", "-", and "_")
const SERVER_TOKEN_KEY = 'server_access_token';
const SERVER_USER_ID_KEY = 'server_user_id';

export const serverAuth = {
  /**
   * Authenticate with server using email/password
   * Call this after Firebase authentication succeeds
   */
  async loginToServer(email: string, password: string): Promise<ServerAuthResponse> {
    try {
      const payload = {
        user: email,
        pwd: password
      };

      if (__DEV__) {
        logger.log('🔐 Attempting server login:', {
          email,
          passwordLength: password?.length,
          baseURL: axios.defaults.baseURL
        });
        logger.log('📦 Login payload:', JSON.stringify(payload));
      }

      const response = await axios.post('/auth', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (__DEV__) {
        logger.log('✅ Server response status:', response.status);
        logger.log('📥 Server response data:', JSON.stringify(response.data));
      }

      const { accessToken, _id, roles } = response.data;

      // Store in SecureStore (encrypted)
      await SecureStore.setItemAsync(SERVER_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(SERVER_USER_ID_KEY, _id);

      logger.log('✅ Server authentication successful, tokens stored securely');
      return { accessToken, _id, roles };
    } catch (error: unknown) {
      logger.error('❌ Server authentication failed');
      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }
      throw error;
    }
  },

  /**
   * Register new user on server
   */
  async registerOnServer(userData: RegisterUserData): Promise<void> {
    try {
      const payload = {
        user: userData.email,
        pwd: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        DOB: userData.DOB
      };

      if (__DEV__) {
        logger.log('📝 Attempting server registration:', {
          email: userData.email,
          hasPassword: !!userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          DOB: userData.DOB
        });
        logger.log('📦 Registration payload:', JSON.stringify(payload));
      }

      const response = await axios.post('/register', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (__DEV__) {
        logger.log('✅ Server registration successful');
        logger.log('📥 Registration response:', JSON.stringify(response.data));
      }
    } catch (error: unknown) {
      logger.error('❌ Server registration failed');
      if (__DEV__ && error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string };
        logger.error('Error status:', axiosError.response?.status);
        logger.error('Error data:', JSON.stringify(axiosError.response?.data));
        logger.error('Error message:', axiosError.message);
      }
      throw error;
    }
  },

  /**
   * Get stored access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(SERVER_TOKEN_KEY);
      return token ?? null; // SecureStore returns undefined, normalize to null
    } catch (error) {
      logger.error('Failed to get access token:', error);
      return null;
    }
  },

  /**
   * Get stored user ID
   */
  async getUserId(): Promise<string | null> {
    try {
      const userId = await SecureStore.getItemAsync(SERVER_USER_ID_KEY);
      return userId ?? null; // SecureStore returns undefined, normalize to null
    } catch (error) {
      logger.error('Failed to get user ID:', error);
      return null;
    }
  },

  /**
   * Clear stored credentials from SecureStore
   */
  async logout(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(SERVER_TOKEN_KEY),
        SecureStore.deleteItemAsync(SERVER_USER_ID_KEY)
      ]);
      logger.log('Server credentials cleared from SecureStore');
    } catch (error) {
      logger.error('Failed to clear server credentials:', error);
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await axios.post('/refresh');
      const { accessToken, _id } = response.data;

      await SecureStore.setItemAsync(SERVER_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(SERVER_USER_ID_KEY, _id);

      logger.log('Token refresh successful');
      return accessToken;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  },

  /**
   * Check if user has valid credentials
   */
  async hasValidCredentials(): Promise<boolean> {
    const token = await this.getAccessToken();
    const userId = await this.getUserId();
    return !!(token && userId);
  }
};
