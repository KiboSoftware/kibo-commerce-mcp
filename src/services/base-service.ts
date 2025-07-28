/**
 * Base Service for Kibo Commerce API interactions
 * 
 * Provides common functionality for all Kibo service classes
 */

import { KiboAuthService } from '../auth/auth-service.js';
import { KiboConfig } from '../types/config.js';
import { ApiCollectionResponse } from '../types/kibo-types.js';

export abstract class BaseKiboService {
  protected authService: KiboAuthService;
  protected config: KiboConfig;

  constructor(authService: KiboAuthService, config: KiboConfig) {
    this.authService = authService;
    this.config = config;
  }

  /**
   * Make a GET request to the Kibo API
   */
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    return this.authService.request<T>({
      method: 'GET',
      url: endpoint,
      params,
    });
  }

  /**
   * Make a POST request to the Kibo API
   */
  protected async post<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
    return this.authService.request<T>({
      method: 'POST',
      url: endpoint,
      data,
      params,
    });
  }

  /**
   * Make a PUT request to the Kibo API
   */
  protected async put<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
    return this.authService.request<T>({
      method: 'PUT',
      url: endpoint,
      data,
      params,
    });
  }

  /**
   * Make a DELETE request to the Kibo API
   */
  protected async delete<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    return this.authService.request<T>({
      method: 'DELETE',
      url: endpoint,
      params,
    });
  }

  /**
   * Build filter string from filter object
   */
  protected buildFilter(filters: Record<string, any>): string {
    const filterParts: string[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          filterParts.push(`${key} eq '${value}'`);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          filterParts.push(`${key} eq ${value}`);
        } else if (value instanceof Date) {
          filterParts.push(`${key} eq datetime'${value.toISOString()}'`);
        }
      }
    }

    return filterParts.join(' and ');
  }

  /**
   * Build pagination parameters
   */
  protected buildPagination(
    startIndex: number = 0,
    pageSize: number = 20
  ): Record<string, any> {
    return {
      startIndex,
      pageSize,
    };
  }

  /**
   * Build response fields parameter
   */
  protected buildResponseFields(fields: string[]): string {
    return fields.join(',');
  }

  /**
   * Handle collection response formatting
   */
  protected formatCollectionResponse<T>(
    response: ApiCollectionResponse<T>,
    dataKey: string = 'items'
  ): {
    [key: string]: T[] | {
      totalCount: number;
      pageCount: number;
      pageSize: number;
      startIndex: number;
    };
    pagination: {
      totalCount: number;
      pageCount: number;
      pageSize: number;
      startIndex: number;
    };
  } {
    return {
      [dataKey]: response.items || [],
      pagination: {
        totalCount: response.totalCount || 0,
        pageCount: response.pageCount || 0,
        pageSize: response.pageSize || 0,
        startIndex: response.startIndex || 0,
      },
    };
  }

  /**
   * Handle API errors and format them for MCP responses
   */
  protected handleError(error: any, operation: string): {
    success: false;
    error: string;
    details: string;
  } {
    console.error(`${operation} failed:`, error);
    
    let errorMessage = 'Unknown error occurred';
    let details = `Failed to ${operation.toLowerCase()}`;

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Handle Axios errors
    if (error.isAxiosError) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = 'Bad request - invalid parameters';
            details = data?.message || data?.errorMessage || details;
            break;
          case 401:
            errorMessage = 'Unauthorized - authentication failed';
            details = 'Please check your API credentials';
            break;
          case 403:
            errorMessage = 'Forbidden - insufficient permissions';
            details = 'Your account does not have permission for this operation';
            break;
          case 404:
            errorMessage = 'Resource not found';
            details = data?.message || data?.errorMessage || 'The requested resource was not found';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded';
            details = 'Too many requests - please try again later';
            break;
          case 500:
            errorMessage = 'Internal server error';
            details = 'A server error occurred - please try again later';
            break;
          default:
            errorMessage = `HTTP ${status} error`;
            details = data?.message || data?.errorMessage || details;
        }
      } else if (error.request) {
        errorMessage = 'Network error';
        details = 'Unable to connect to Kibo Commerce API';
      }
    }

    return {
      success: false,
      error: errorMessage,
      details,
    };
  }

  /**
   * Validate required parameters
   */
  protected validateRequired(params: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => 
      params[param] === undefined || params[param] === null || params[param] === ''
    );

    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Encode URI component safely
   */
  protected encodeParam(param: string | number): string {
    return encodeURIComponent(param.toString());
  }

  /**
   * Format success response for MCP
   */
  protected formatSuccessResponse<T>(data: T, message?: string): {
    success: true;
    data: T;
    message?: string;
  } {
    const response: any = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    return response;
  }
}