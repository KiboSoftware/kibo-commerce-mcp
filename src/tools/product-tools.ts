/**
 * Kibo Commerce Product Management Tools
 * 
 * MCP tools for product catalog operations including:
 * - Product search and retrieval
 * - Category management
 * - Product details and variants
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { KiboAuthService } from '../auth/auth-service.js';
import { KiboConfig } from '../types/config.js';
import { z } from 'zod';

// Validation schemas
const ProductSearchSchema = z.object({
  query: z.string().optional().describe('Search query for product name, description, or SKU'),
  categoryCode: z.string().optional().describe('Category code to filter products'),
  startIndex: z.number().min(0).default(0).describe('Starting index for pagination'),
  pageSize: z.number().min(1).max(200).default(20).describe('Number of products to return'),
  sortBy: z.string().optional().describe('Sort field (e.g., "createDate desc", "productName asc")'),
  includeDetails: z.boolean().default(false).describe('Include detailed product information'),
});

const ProductDetailSchema = z.object({
  productCode: z.string().describe('Product code or SKU to retrieve'),
  includeVariations: z.boolean().default(true).describe('Include product variations'),
  includePricing: z.boolean().default(true).describe('Include pricing information'),
  includeInventory: z.boolean().default(true).describe('Include inventory levels'),
});

const CategorySearchSchema = z.object({
  parentCategoryCode: z.string().optional().describe('Parent category code to filter subcategories'),
  includeProducts: z.boolean().default(false).describe('Include products in each category'),
  maxDepth: z.number().min(1).max(5).default(3).describe('Maximum depth of category tree'),
});

/**
 * Register product-related MCP tools
 */
export async function registerProductTools(): Promise<Tool[]> {
  return [
    {
      name: 'kibo_product_search',
      description: 'Search for products in the Kibo Commerce catalog with filtering and pagination options',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for product name, description, or SKU'
          },
          categoryCode: {
            type: 'string',
            description: 'Category code to filter products'
          },
          startIndex: {
            type: 'number',
            minimum: 0,
            default: 0,
            description: 'Starting index for pagination'
          },
          pageSize: {
            type: 'number',
            minimum: 1,
            maximum: 200,
            default: 20,
            description: 'Number of products to return'
          },
          sortBy: {
            type: 'string',
            description: 'Sort field (e.g., "createDate desc", "productName asc")'
          },
          includeDetails: {
            type: 'boolean',
            default: false,
            description: 'Include detailed product information'
          }
        }
      }
    },
    {
      name: 'kibo_product_details',
      description: 'Get detailed information about a specific product including variations, pricing, and inventory',
      inputSchema: {
        type: 'object',
        properties: {
          productCode: {
            type: 'string',
            description: 'Product code or SKU to retrieve'
          },
          includeVariations: {
            type: 'boolean',
            default: true,
            description: 'Include product variations'
          },
          includePricing: {
            type: 'boolean',
            default: true,
            description: 'Include pricing information'
          },
          includeInventory: {
            type: 'boolean',
            default: true,
            description: 'Include inventory levels'
          }
        },
        required: ['productCode']
      }
    },
    {
      name: 'kibo_category_list',
      description: 'Retrieve product categories and category tree structure',
      inputSchema: {
        type: 'object',
        properties: {
          parentCategoryCode: {
            type: 'string',
            description: 'Parent category code to filter subcategories'
          },
          includeProducts: {
            type: 'boolean',
            default: false,
            description: 'Include products in each category'
          },
          maxDepth: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            default: 3,
            description: 'Maximum depth of category tree'
          }
        }
      }
    }
  ];
}

/**
 * Handle product tool execution
 */
export async function handleProductTools(
  name: string,
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  switch (name) {
    case 'kibo_product_search':
      return handleProductSearch(args, authService, config);
    case 'kibo_product_details':
      return handleProductDetails(args, authService, config);
    case 'kibo_category_list':
      return handleCategoryList(args, authService, config);
    default:
      throw new Error(`Unknown product tool: ${name}`);
  }
}

/**
 * Search for products
 */
async function handleProductSearch(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = ProductSearchSchema.parse(args);
  
  try {
    // Build query parameters
    const queryParams: any = {
      startIndex: params.startIndex,
      pageSize: params.pageSize,
    };

    if (params.query) {
      queryParams.q = params.query;
    }

    if (params.categoryCode) {
      queryParams.filter = `categoryCode eq ${params.categoryCode}`;
    }

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }

    // Add response fields based on detail level
    const responseFields = params.includeDetails 
      ? 'items(productCode,productName,description,price,salePrice,imageUrl,categoryId,variations,inventoryInfo,options),totalCount,pageCount,pageSize,startIndex'
      : 'items(productCode,productName,price,salePrice,imageUrl,categoryId),totalCount,pageCount,pageSize,startIndex';

    queryParams.responseFields = responseFields;

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/catalog/storefront/products`,
      params: queryParams,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              products: response.items || [],
              pagination: {
                totalCount: response.totalCount || 0,
                pageCount: response.pageCount || 0,
                pageSize: response.pageSize || 0,
                startIndex: response.startIndex || 0,
              }
            }
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Product search failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to search products'
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get product details
 */
async function handleProductDetails(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = ProductDetailSchema.parse(args);
  
  try {
    // Build response fields based on requested information
    const responseFields = [
      'productCode',
      'productName', 
      'description',
      'content',
      'price',
      'salePrice',
      'imageUrl',
      'images',
      'categoryId',
      'productUsage',
      'fulfillmentTypesSupported',
      'isPackagedStandAlone'
    ];

    if (params.includeVariations) {
      responseFields.push('variations', 'options', 'properties');
    }

    if (params.includePricing) {
      responseFields.push('priceRange', 'priceListEntries');
    }

    if (params.includeInventory) {
      responseFields.push('inventoryInfo');
    }

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/catalog/storefront/products/${encodeURIComponent(params.productCode)}`,
      params: {
        responseFields: responseFields.join(',')
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: response
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Product details retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to retrieve product details for: ${params.productCode}`
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get category list
 */
async function handleCategoryList(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = CategorySearchSchema.parse(args);
  
  try {
    const queryParams: any = {};

    if (params.parentCategoryCode) {
      queryParams.filter = `parentCategoryCode eq ${params.parentCategoryCode}`;
    }

    // Build response fields
    const responseFields = [
      'categoryCode',
      'categoryId', 
      'content',
      'parentCategoryCode',
      'isDisplayed',
      'count',
      'childrenCategories'
    ];

    if (params.includeProducts) {
      responseFields.push('products');
    }

    queryParams.responseFields = responseFields.join(',');

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/catalog/storefront/categories`,
      params: queryParams,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              categories: response.items || [],
              totalCount: response.totalCount || 0
            }
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Category list retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to retrieve categories'
          }, null, 2)
        }
      ]
    };
  }
}