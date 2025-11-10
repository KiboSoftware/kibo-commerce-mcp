/**
 * Product Tools Test Suite
 *
 * Tests for product management tools including read and write operations
 */

import { jest } from '@jest/globals';
import { KiboAuthService } from '../../src/auth/auth-service.js';
import { KiboConfig } from '../../src/types/config.js';
import { handleProductTools } from '../../src/tools/product-tools.js';

// Mock the auth service
jest.mock('../../src/auth/auth-service.js');

describe('Product Tools', () => {
  let mockAuthService: jest.Mocked<KiboAuthService>;
  let mockConfig: KiboConfig;

  beforeEach(() => {
    // Create mock auth service
    mockAuthService = {
      request: jest.fn(),
    } as any;

    // Create mock config
    mockConfig = {
      apiHost: 'https://test.mozu.com',
      clientId: 'test-client',
      clientSecret: 'test-secret',
      tenantId: 12345,
      siteId: 54321,
      locale: 'en-US',
      currency: 'USD',
      logLevel: 'info',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('kibo_product_search', () => {
    it('should search products with query parameter', async () => {
      const mockResponse = {
        items: [
          {
            productCode: 'PROD-001',
            productName: 'Test Product',
            price: 29.99,
          },
        ],
        totalCount: 1,
        pageCount: 1,
        pageSize: 20,
        startIndex: 0,
      };

      mockAuthService.request.mockResolvedValue(mockResponse);

      const result = await handleProductTools(
        'kibo_product_search',
        { query: 'test', pageSize: 20 },
        mockAuthService,
        mockConfig
      );

      expect(mockAuthService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/commerce/catalog/storefront/products',
        params: expect.objectContaining({
          q: 'test',
          pageSize: 20,
        }),
      });

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.products).toHaveLength(1);
      expect(response.data.products[0].productCode).toBe('PROD-001');
    });

    it('should handle search errors gracefully', async () => {
      mockAuthService.request.mockRejectedValue(new Error('API Error'));

      const result = await handleProductTools(
        'kibo_product_search',
        { query: 'test' },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toBe('API Error');
    });
  });

  describe('kibo_product_details', () => {
    it('should retrieve product details', async () => {
      const mockProduct = {
        productCode: 'PROD-001',
        productName: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        content: {
          productFullDescription: 'Full description',
        },
      };

      mockAuthService.request.mockResolvedValue(mockProduct);

      const result = await handleProductTools(
        'kibo_product_details',
        { productCode: 'PROD-001' },
        mockAuthService,
        mockConfig
      );

      expect(mockAuthService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/commerce/catalog/storefront/products/PROD-001',
        params: expect.objectContaining({
          responseFields: expect.any(String),
        }),
      });

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.productCode).toBe('PROD-001');
    });

    it('should handle product not found', async () => {
      mockAuthService.request.mockRejectedValue(new Error('Product not found'));

      const result = await handleProductTools(
        'kibo_product_details',
        { productCode: 'INVALID' },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Product not found');
    });
  });

  describe('kibo_product_update', () => {
    it('should update product description successfully', async () => {
      const currentProduct = {
        productCode: 'PROD-001',
        productName: 'Test Product',
        price: 29.99,
        content: {
          productFullDescription: 'Old description',
          productShortDescription: 'Old short',
        },
        auditInfo: {
          createDate: '2025-01-01T00:00:00Z',
          createBy: 'system',
        },
      };

      const updatedProduct = {
        ...currentProduct,
        content: {
          ...currentProduct.content,
          productFullDescription: 'New AI-enriched description',
        },
        auditInfo: {
          ...currentProduct.auditInfo,
          updateDate: '2025-01-10T00:00:00Z',
          updateBy: 'mcp-server',
        },
      };

      // Mock GET request (read current state)
      mockAuthService.request.mockResolvedValueOnce(currentProduct);
      // Mock PUT request (update)
      mockAuthService.request.mockResolvedValueOnce(updatedProduct);

      const result = await handleProductTools(
        'kibo_product_update',
        {
          productCode: 'PROD-001',
          content: {
            productFullDescription: 'New AI-enriched description',
          },
        },
        mockAuthService,
        mockConfig
      );

      // Verify GET request
      expect(mockAuthService.request).toHaveBeenNthCalledWith(1, {
        method: 'GET',
        url: '/api/commerce/catalog/admin/products/PROD-001',
      });

      // Verify PUT request
      expect(mockAuthService.request).toHaveBeenNthCalledWith(2, {
        method: 'PUT',
        url: '/api/commerce/catalog/admin/products/PROD-001',
        data: expect.objectContaining({
          productCode: 'PROD-001',
          content: expect.objectContaining({
            productFullDescription: 'New AI-enriched description',
          }),
        }),
      });

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.productCode).toBe('PROD-001');
      expect(response.data.changes.content).toBeDefined();
      expect(response.message).toContain('updated successfully');
    });

    it('should update multiple fields at once', async () => {
      const currentProduct = {
        productCode: 'PROD-002',
        productName: 'Test Product',
        price: 29.99,
        salePrice: 19.99,
        content: {
          productFullDescription: 'Old description',
          metaTagDescription: 'Old meta',
        },
        auditInfo: {},
      };

      const updatedProduct = {
        ...currentProduct,
        price: 39.99,
        salePrice: 29.99,
        content: {
          ...currentProduct.content,
          productFullDescription: 'New description',
          metaTagDescription: 'New meta description',
        },
      };

      mockAuthService.request.mockResolvedValueOnce(currentProduct);
      mockAuthService.request.mockResolvedValueOnce(updatedProduct);

      const result = await handleProductTools(
        'kibo_product_update',
        {
          productCode: 'PROD-002',
          content: {
            productFullDescription: 'New description',
            metaTagDescription: 'New meta description',
          },
          price: 39.99,
          salePrice: 29.99,
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.changes.content).toBeDefined();
      expect(response.data.changes.price).toBeDefined();
      expect(response.data.changes.salePrice).toBeDefined();
    });

    it('should handle update errors gracefully', async () => {
      mockAuthService.request.mockRejectedValue(new Error('Permission denied'));

      const result = await handleProductTools(
        'kibo_product_update',
        {
          productCode: 'PROD-001',
          content: { productFullDescription: 'New' },
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Permission denied');
      expect(response.details).toContain('Failed to update product');
    });

    it('should preserve existing data when updating partial fields', async () => {
      const currentProduct = {
        productCode: 'PROD-003',
        productName: 'Test Product',
        price: 50.0,
        content: {
          productFullDescription: 'Full desc',
          productShortDescription: 'Short desc',
          metaTagDescription: 'Meta desc',
        },
        auditInfo: {},
      };

      mockAuthService.request.mockResolvedValueOnce(currentProduct);
      mockAuthService.request.mockResolvedValueOnce(currentProduct);

      await handleProductTools(
        'kibo_product_update',
        {
          productCode: 'PROD-003',
          content: {
            productFullDescription: 'Updated full desc',
          },
        },
        mockAuthService,
        mockConfig
      );

      const putCall = mockAuthService.request.mock.calls[1];
      const updateData = putCall[0].data;

      // Verify short description and meta are preserved
      expect(updateData.content.productShortDescription).toBe('Short desc');
      expect(updateData.content.metaTagDescription).toBe('Meta desc');
      expect(updateData.content.productFullDescription).toBe('Updated full desc');
    });
  });

  describe('kibo_product_create', () => {
    it('should create a new product with minimal required fields', async () => {
      const newProduct = {
        productCode: 'NEW-PROD-001',
        productName: 'New Product',
        productTypeId: 1,
        productUsage: 'Standard',
        content: {
          productName: 'New Product',
        },
        auditInfo: {
          createDate: '2025-01-10T00:00:00Z',
          createBy: 'mcp-server',
        },
      };

      mockAuthService.request.mockResolvedValue(newProduct);

      const result = await handleProductTools(
        'kibo_product_create',
        {
          productCode: 'NEW-PROD-001',
          productName: 'New Product',
        },
        mockAuthService,
        mockConfig
      );

      expect(mockAuthService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/commerce/catalog/admin/products',
        data: expect.objectContaining({
          productCode: 'NEW-PROD-001',
          content: expect.objectContaining({
            productName: 'New Product',
          }),
        }),
      });

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.productCode).toBe('NEW-PROD-001');
      expect(response.message).toContain('created successfully');
    });

    it('should create a product with full details', async () => {
      const newProduct = {
        productCode: 'NEW-PROD-002',
        productName: 'Detailed Product',
        price: 99.99,
        content: {
          productName: 'Detailed Product',
          productFullDescription: 'Full description here',
          productShortDescription: 'Short description',
        },
        auditInfo: {
          createDate: '2025-01-10T00:00:00Z',
        },
      };

      mockAuthService.request.mockResolvedValue(newProduct);

      const result = await handleProductTools(
        'kibo_product_create',
        {
          productCode: 'NEW-PROD-002',
          productName: 'Detailed Product',
          productFullDescription: 'Full description here',
          productShortDescription: 'Short description',
          price: 99.99,
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(true);
      expect(response.data.price).toBe(99.99);
    });

    it('should handle duplicate product code error', async () => {
      mockAuthService.request.mockRejectedValue(
        new Error('Product code already exists')
      );

      const result = await handleProductTools(
        'kibo_product_create',
        {
          productCode: 'DUPLICATE',
          productName: 'Duplicate Product',
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Product code already exists');
    });

    it('should set default values for optional fields', async () => {
      mockAuthService.request.mockResolvedValue({
        productCode: 'TEST',
        productName: 'Test',
      } as any);

      await handleProductTools(
        'kibo_product_create',
        {
          productCode: 'TEST',
          productName: 'Test',
        },
        mockAuthService,
        mockConfig
      );

      const callData = mockAuthService.request.mock.calls[0][0].data;
      expect(callData.productTypeId).toBe(1);
      expect(callData.productUsage).toBe('Standard');
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid product update without productCode', async () => {
      await expect(
        handleProductTools(
          'kibo_product_update',
          {
            content: { productFullDescription: 'Test' },
          },
          mockAuthService,
          mockConfig
        )
      ).rejects.toThrow();
    });

    it('should reject invalid product create without required fields', async () => {
      await expect(
        handleProductTools(
          'kibo_product_create',
          {
            productCode: 'TEST',
            // Missing productName
          },
          mockAuthService,
          mockConfig
        )
      ).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors in update', async () => {
      mockAuthService.request.mockRejectedValue(new Error('Network timeout'));

      const result = await handleProductTools(
        'kibo_product_update',
        {
          productCode: 'PROD-001',
          content: { productFullDescription: 'Test' },
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toContain('Network timeout');
    });

    it('should handle authentication errors', async () => {
      mockAuthService.request.mockRejectedValue(new Error('Unauthorized'));

      const result = await handleProductTools(
        'kibo_product_create',
        {
          productCode: 'TEST',
          productName: 'Test',
        },
        mockAuthService,
        mockConfig
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Unauthorized');
    });
  });
});
