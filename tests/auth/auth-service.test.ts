/**
 * Tests for KiboAuthService
 */

import axios from 'axios';
import { KiboAuthService } from '../../src/auth/auth-service.js';
import { KiboConfig } from '../../src/types/config.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('KiboAuthService', () => {
  let authService: KiboAuthService;
  let config: KiboConfig;

  beforeEach(() => {
    config = {
      apiHost: 'https://t12345.sandbox.mozu.com',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      tenantId: 12345,
      siteId: 67890,
      locale: 'en-US',
      currency: 'USD',
      logLevel: 'error'
    };

    // Mock axios.create
    const mockAxiosInstance = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      request: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    
    authService = new KiboAuthService(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create auth service with config', () => {
      expect(authService).toBeInstanceOf(KiboAuthService);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.apiHost,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('initialize', () => {
    it('should authenticate successfully', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'refresh-token'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      await authService.initialize();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${config.apiHost}/api/platform/applications/authtickets/oauth`,
        {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: 'client_credentials'
        },
        expect.any(Object)
      );
    });

    it('should handle authentication failure', async () => {
      const mockError = new Error('Authentication failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(authService.initialize()).rejects.toThrow('Kibo authentication failed');
    });
  });

  describe('getAccessToken', () => {
    it('should return valid token when available', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'refresh-token'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);
      await authService.initialize();

      const token = await authService.getAccessToken();
      expect(token).toBe('test-token');
    });
  });

  describe('getTokenInfo', () => {
    it('should return token info when tokens exist', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'refresh-token'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);
      await authService.initialize();

      const tokenInfo = authService.getTokenInfo();
      expect(tokenInfo.hasToken).toBe(true);
      expect(tokenInfo.isValid).toBe(true);
      expect(tokenInfo.expiresAt).toBeInstanceOf(Date);
    });

    it('should return no token info when tokens do not exist', () => {
      const tokenInfo = authService.getTokenInfo();
      expect(tokenInfo.hasToken).toBe(false);
      expect(tokenInfo.expiresAt).toBeUndefined();
      expect(tokenInfo.isValid).toBeUndefined();
    });
  });

  describe('request', () => {
    it('should make authenticated request successfully', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'refresh-token'
        }
      };

      const mockApiResponse = {
        data: { result: 'success' }
      };

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);
      const mockAxiosInstance = authService.getHttpClient();
      jest.spyOn(mockAxiosInstance, 'request').mockResolvedValueOnce(mockApiResponse);

      await authService.initialize();
      const result = await authService.request({ method: 'GET', url: '/test' });

      expect(result).toEqual({ result: 'success' });
    });
  });
});