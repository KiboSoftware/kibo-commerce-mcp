/**
 * Kibo Commerce Inventory Management Tools
 * 
 * MCP tools for inventory operations including:
 * - Inventory level queries
 * - Stock availability checks
 * - Inventory updates (if permissions allow)
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { KiboAuthService } from '../auth/auth-service.js';
import { KiboConfig } from '../types/config.js';
import { z } from 'zod';

// Validation schemas
const InventorySearchSchema = z.object({
  productCode: z.string().optional().describe('Product code to check inventory'),
  locationCode: z.string().optional().describe('Location code to filter inventory'),
  includeReserved: z.boolean().default(true).describe('Include reserved inventory quantities'),
  includeAllocated: z.boolean().default(true).describe('Include allocated inventory quantities'),
  startIndex: z.number().min(0).default(0).describe('Starting index for pagination'),
  pageSize: z.number().min(1).max(200).default(50).describe('Number of inventory records to return'),
});

const InventoryDetailSchema = z.object({
  productCode: z.string().describe('Product code to get detailed inventory'),
  locationCode: z.string().optional().describe('Specific location code (if not provided, returns all locations)'),
  includeHistory: z.boolean().default(false).describe('Include inventory transaction history'),
});

const StockAvailabilitySchema = z.object({
  productCodes: z.array(z.string()).describe('Array of product codes to check availability'),
  locationCode: z.string().optional().describe('Location code to check availability'),
  quantity: z.number().min(1).default(1).describe('Quantity to check availability for'),
});

/**
 * Register inventory-related MCP tools
 */
export async function registerInventoryTools(): Promise<Tool[]> {
  return [
    {
      name: 'kibo_inventory_search',
      description: 'Search inventory levels across products and locations with filtering options',
      inputSchema: {
        type: 'object',
        properties: {
          productCode: {
            type: 'string',
            description: 'Product code to check inventory'
          },
          locationCode: {
            type: 'string',
            description: 'Location code to filter inventory'
          },
          includeReserved: {
            type: 'boolean',
            default: true,
            description: 'Include reserved inventory quantities'
          },
          includeAllocated: {
            type: 'boolean',
            default: true,
            description: 'Include allocated inventory quantities'
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
            default: 50,
            description: 'Number of inventory records to return'
          }
        }
      }
    },
    {
      name: 'kibo_inventory_details',
      description: 'Get detailed inventory information for a specific product across all or specific locations',
      inputSchema: {
        type: 'object',
        properties: {
          productCode: {
            type: 'string',
            description: 'Product code to get detailed inventory'
          },
          locationCode: {
            type: 'string',
            description: 'Specific location code (if not provided, returns all locations)'
          },
          includeHistory: {
            type: 'boolean',
            default: false,
            description: 'Include inventory transaction history'
          }
        },
        required: ['productCode']
      }
    },
    {
      name: 'kibo_stock_availability',
      description: 'Check stock availability for multiple products at a specific location',
      inputSchema: {
        type: 'object',
        properties: {
          productCodes: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of product codes to check availability'
          },
          locationCode: {
            type: 'string',
            description: 'Location code to check availability'
          },
          quantity: {
            type: 'number',
            minimum: 1,
            default: 1,
            description: 'Quantity to check availability for'
          }
        },
        required: ['productCodes']
      }
    }
  ];
}

/**
 * Handle inventory tool execution
 */
export async function handleInventoryTools(
  name: string,
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  switch (name) {
    case 'kibo_inventory_search':
      return handleInventorySearch(args, authService, config);
    case 'kibo_inventory_details':
      return handleInventoryDetails(args, authService, config);
    case 'kibo_stock_availability':
      return handleStockAvailability(args, authService, config);
    default:
      throw new Error(`Unknown inventory tool: ${name}`);
  }
}

/**
 * Search inventory levels
 */
async function handleInventorySearch(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = InventorySearchSchema.parse(args);
  
  try {
    // Build query parameters
    const queryParams: any = {
      startIndex: params.startIndex,
      pageSize: params.pageSize,
    };

    // Build filter conditions
    const filters: string[] = [];

    if (params.productCode) {
      filters.push(`productCode eq '${params.productCode}'`);
    }

    if (params.locationCode) {
      filters.push(`locationCode eq '${params.locationCode}'`);
    }

    if (filters.length > 0) {
      queryParams.filter = filters.join(' and ');
    }

    // Build response fields based on requested information
    const responseFields = [
      'productCode',
      'locationCode',
      'stockOnHand',
      'available',
      'allocated',
      'pending'
    ];

    if (params.includeReserved) {
      responseFields.push('reserved');
    }

    if (params.includeAllocated) {
      responseFields.push('allocated');
    }

    queryParams.responseFields = `items(${responseFields.join(',')}),totalCount,pageCount,pageSize,startIndex`;

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/inventory`,
      params: queryParams,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              inventory: response.items || [],
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
    console.error('Inventory search failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to search inventory'
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get detailed inventory for a product
 */
async function handleInventoryDetails(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = InventoryDetailSchema.parse(args);
  
  try {
    let url = `/api/commerce/inventory/${encodeURIComponent(params.productCode)}`;
    const queryParams: any = {};

    // If location is specified, get inventory for that specific location
    if (params.locationCode) {
      url += `/${encodeURIComponent(params.locationCode)}`;
    }

    // Build response fields
    const responseFields = [
      'productCode',
      'locationCode',
      'stockOnHand',
      'available',
      'allocated',
      'pending',
      'reserved',
      'lastUpdated'
    ];

    if (params.includeHistory) {
      responseFields.push('transactions');
    }

    queryParams.responseFields = responseFields.join(',');

    const response = await authService.request({
      method: 'GET',
      url: url,
      params: queryParams,
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
    console.error('Inventory details retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to retrieve inventory details for product: ${params.productCode}`
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Check stock availability for multiple products
 */
async function handleStockAvailability(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = StockAvailabilitySchema.parse(args);
  
  try {
    const availabilityResults = [];

    // Check availability for each product
    for (const productCode of params.productCodes) {
      try {
        const queryParams: any = {
          quantity: params.quantity,
        };

        if (params.locationCode) {
          queryParams.locationCode = params.locationCode;
        }

        // Use the product availability endpoint
        const response = await authService.request({
          method: 'GET',
          url: `/api/commerce/catalog/storefront/products/${encodeURIComponent(productCode)}/inventoryinfo`,
          params: queryParams,
        });

        availabilityResults.push({
          productCode: productCode,
          isAvailable: response.onlineStockAvailable >= params.quantity,
          stockOnHand: response.onlineStockAvailable || 0,
          requestedQuantity: params.quantity,
          locationCode: params.locationCode || 'default'
        });
      } catch (productError) {
        availabilityResults.push({
          productCode: productCode,
          isAvailable: false,
          error: productError instanceof Error ? productError.message : 'Unknown error',
          requestedQuantity: params.quantity,
          locationCode: params.locationCode || 'default'
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              availabilityCheck: {
                locationCode: params.locationCode || 'default',
                requestedQuantity: params.quantity,
                results: availabilityResults,
                summary: {
                  totalProductsChecked: params.productCodes.length,
                  availableProducts: availabilityResults.filter(r => r.isAvailable).length,
                  unavailableProducts: availabilityResults.filter(r => !r.isAvailable).length
                }
              }
            }
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Stock availability check failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to check stock availability'
          }, null, 2)
        }
      ]
    };
  }
}