/**
 * Kibo Commerce Authentication Service
 * 
 * Handles OAuth2 authentication with Kibo Commerce API,
 * including token management, refresh, and caching.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KiboConfig, AuthTokens } from '../types/config.js';

export class KiboAuthService {
  private config: KiboConfig;
  private tokens: AuthTokens | null = null;
  private httpClient: AxiosInstance;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(config: KiboConfig) {
    this.config = config;
    this.httpClient = axios.create({
      baseURL: config.apiHost,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.httpClient.interceptors.request.use(
      (config) => this.addAuthHeaders(config),
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            await this.refreshAccessToken();
            return this.httpClient.request(error.config);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize the authentication service by obtaining initial tokens
   */
  async initialize(): Promise<void> {
    try {
      await this.authenticate();
      console.log('Kibo authentication initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Kibo authentication:', error);
      throw error;
    }
  }

  /**
   * Authenticate with Kibo Commerce using client credentials
   */
  private async authenticate(): Promise<AuthTokens> {
    const authUrl = `${this.config.apiHost}/api/platform/applications/authtickets/oauth`;
    
    const authData = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials'
    };

    try {
      const response = await axios.post(authUrl, authData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      const tokenData = response.data;
      
      this.tokens = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type || 'Bearer',
        expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
        refreshToken: tokenData.refresh_token,
      };

      return this.tokens;
    } catch (error) {
      console.error('Authentication failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw new Error(`Kibo authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh the access token if needed
   */
  private async refreshAccessToken(): Promise<AuthTokens> {
    // Prevent concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.authenticate();
    
    try {
      const tokens = await this.refreshPromise;
      this.refreshPromise = null;
      return tokens;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  /**
   * Get current valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    // Check if we have tokens and they're not expired
    if (this.tokens && this.isTokenValid()) {
      return this.tokens.accessToken;
    }

    // Refresh tokens if needed
    const tokens = await this.refreshAccessToken();
    return tokens.accessToken;
  }

  /**
   * Check if current token is valid (not expired with buffer)
   */
  private isTokenValid(): boolean {
    if (!this.tokens) {
      return false;
    }

    // Add 5 minute buffer before expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = new Date();
    
    return this.tokens.expiresAt.getTime() > (now.getTime() + bufferTime);
  }

  /**
   * Add authentication headers to request config
   */
  private async addAuthHeaders(config: any): Promise<any> {
    // Skip auth for authentication requests
    if (config.url?.includes('/authtickets/oauth')) {
      return config;
    }

    try {
      const token = await this.getAccessToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add tenant context headers
      config.headers['x-vol-tenant'] = this.config.tenantId.toString();
      if (this.config.siteId) {
        config.headers['x-vol-site'] = this.config.siteId.toString();
      }
      if (this.config.masterCatalogId) {
        config.headers['x-vol-master-catalog'] = this.config.masterCatalogId.toString();
      }
      
      return config;
    } catch (error) {
      console.error('Failed to add auth headers:', error);
      throw error;
    }
  }

  /**
   * Get authenticated HTTP client
   */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /**
   * Make authenticated API request
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.httpClient.request<T>(config);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  /**
   * Get current token information (for debugging)
   */
  getTokenInfo(): { hasToken: boolean; expiresAt?: Date; isValid?: boolean } {
    if (!this.tokens) {
      return { hasToken: false };
    }

    return {
      hasToken: true,
      expiresAt: this.tokens.expiresAt,
      isValid: this.isTokenValid(),
    };
  }
}