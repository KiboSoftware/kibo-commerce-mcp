/**
 * Kibo Commerce MCP Server Configuration Types
 */

export interface KiboConfig {
  /** Kibo API host URL */
  apiHost: string;
  
  /** Application client ID */
  clientId: string;
  
  /** Application client secret */
  clientSecret: string;
  
  /** Tenant ID */
  tenantId: number;
  
  /** Site ID */
  siteId: number;
  
  /** Master catalog ID (optional) */
  masterCatalogId?: number;
  
  /** Locale for API requests */
  locale: string;
  
  /** Currency code */
  currency: string;
  
  /** Logging level */
  logLevel: string;
}

export interface KiboApiContext {
  /** Tenant ID */
  tenantId: number;
  
  /** Site ID */
  siteId: number;
  
  /** Master catalog ID */
  masterCatalogId?: number;
  
  /** Locale */
  locale: string;
  
  /** Currency */
  currency: string;
}

export interface AuthTokens {
  /** Access token */
  accessToken: string;
  
  /** Token type (usually 'Bearer') */
  tokenType: string;
  
  /** Token expiration time */
  expiresAt: Date;
  
  /** Refresh token (if available) */
  refreshToken?: string;
}