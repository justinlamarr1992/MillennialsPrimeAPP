/**
 * Server Authentication Service
 * Handles authentication with the Express.js/MongoDB backend
 * Separate from Firebase Auth - manages JWT tokens for API access
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
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

const SERVER_TOKEN_KEY = '@server_access_token';
const SERVER_USER_ID_KEY = '@server_user_id';

export const serverAuth = {
  /**
   * Authenticate with server using email/password
   * Call this after Firebase authentication succeeds
   */
  async loginToServer(email: string, password: string): Promise<ServerAuthResponse> {
    try {
      const response = await axios.post('/auth', {
        user: email,
        pwd: password
      });

      const { accessToken, _id, roles } = response.data;

      await AsyncStorage.setItem(SERVER_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(SERVER_USER_ID_KEY, _id);

      logger.log('Server authentication successful');
      return { accessToken, _id, roles };
    } catch (error) {
      logger.error('Server authentication failed:', error);
      throw error;
    }
  },

  /**
   * Register new user on server
   */
  async registerOnServer(userData: RegisterUserData): Promise<void> {
    try {
      await axios.post('/register', {
        user: userData.email,
        pwd: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        DOB: userData.DOB
      });

      logger.log('Server registration successful');
    } catch (error) {
      logger.error('Server registration failed:', error);
      throw error;
    }
  },

  /**
   * Get stored access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(SERVER_TOKEN_KEY);
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
      return await AsyncStorage.getItem(SERVER_USER_ID_KEY);
    } catch (error) {
      logger.error('Failed to get user ID:', error);
      return null;
    }
  },

  /**
   * Clear stored credentials
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([SERVER_TOKEN_KEY, SERVER_USER_ID_KEY]);
      logger.log('Server credentials cleared');
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

      await AsyncStorage.setItem(SERVER_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(SERVER_USER_ID_KEY, _id);

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
