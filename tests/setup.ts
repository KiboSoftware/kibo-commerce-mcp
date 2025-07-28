/**
 * Jest setup file for Kibo Commerce MCP Server tests
 */

import dotenv from 'dotenv';
import { KiboConfig, AuthTokens } from '../src/types/config.js';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

// Set up test timeouts
jest.setTimeout(30000);

// Extend global interface for test utilities
declare global {
  var mockKiboConfig: KiboConfig;
  var mockAuthTokens: AuthTokens;
}

// Global test utilities
(global as any).mockKiboConfig = {
  apiHost: 'https://t12345.sandbox.mozu.com',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  tenantId: 12345,
  siteId: 67890,
  locale: 'en-US',
  currency: 'USD',
  logLevel: 'error'
} as KiboConfig;

(global as any).mockAuthTokens = {
  accessToken: 'mock-access-token',
  tokenType: 'Bearer',
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  refreshToken: 'mock-refresh-token'
} as AuthTokens;