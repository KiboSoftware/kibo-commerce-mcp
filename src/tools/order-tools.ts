/**
 * Kibo Commerce Order Management Tools
 * 
 * MCP tools for order operations including:
 * - Order search and retrieval
 * - Order status updates
 * - Fulfillment management
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { KiboAuthService } from '../auth/auth-service.js';
import { KiboConfig } from '../types/config.js';
import { z } from 'zod';

// Validation schemas
const OrderSearchSchema = z.object({
  customerEmailAddress: z.string().optional().describe('Customer email address to filter orders'),
  status: z.string().optional().describe('Order status (e.g., "Pending", "Processing", "Completed", "Cancelled")'),
  startDate: z.string().optional().describe('Start date for order search (ISO format)'),
  endDate: z.string().optional().describe('End date for order search (ISO format)'),
  orderNumber: z.string().optional().describe('Specific order number to search'),
  startIndex: z.number().min(0).default(0).describe('Starting index for pagination'),
  pageSize: z.number().min(1).max(200).default(20).describe('Number of orders to return'),
  sortBy: z.string().optional().describe('Sort field (e.g., "orderDate desc", "orderNumber asc")'),
});

const OrderDetailSchema = z.object({
  orderNumber: z.string().describe('Order number to retrieve'),
  includeItems: z.boolean().default(true).describe('Include order line items'),
  includePayments: z.boolean().default(true).describe('Include payment information'),
  includeFulfillment: z.boolean().default(true).describe('Include fulfillment information'),
});

const OrderStatusUpdateSchema = z.object({
  orderNumber: z.string().describe('Order number to update'),
  status: z.string().describe('New order status'),
  note: z.string().optional().describe('Optional note for status change'),
});

/**
 * Register order-related MCP tools
 */
export async function registerOrderTools(): Promise<Tool[]> {
  return [
    {
      name: 'kibo_order_search',
      description: 'Search for orders with filtering options including customer email, status, and date range',
      inputSchema: {
        type: 'object',
        properties: {
          customerEmailAddress: {
            type: 'string',
            description: 'Customer email address to filter orders'
          },
          status: {
            type: 'string',
            description: 'Order status (e.g., "Pending", "Processing", "Completed", "Cancelled")'
          },
          startDate: {
            type: 'string',
            description: 'Start date for order search (ISO format)'
          },
          endDate: {
            type: 'string',
            description: 'End date for order search (ISO format)'
          },
          orderNumber: {
            type: 'string',
            description: 'Specific order number to search'
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
            description: 'Number of orders to return'
          },
          sortBy: {
            type: 'string',
            description: 'Sort field (e.g., "orderDate desc", "orderNumber asc")'
          }
        }
      }
    },
    {
      name: 'kibo_order_details',
      description: 'Get detailed information about a specific order including items, payments, and fulfillment',
      inputSchema: {
        type: 'object',
        properties: {
          orderNumber: {
            type: 'string',
            description: 'Order number to retrieve'
          },
          includeItems: {
            type: 'boolean',
            default: true,
            description: 'Include order line items'
          },
          includePayments: {
            type: 'boolean',
            default: true,
            description: 'Include payment information'
          },
          includeFulfillment: {
            type: 'boolean',
            default: true,
            description: 'Include fulfillment information'
          }
        },
        required: ['orderNumber']
      }
    },
    {
      name: 'kibo_order_status_update',
      description: 'Update the status of an order with optional notes',
      inputSchema: {
        type: 'object',
        properties: {
          orderNumber: {
            type: 'string',
            description: 'Order number to update'
          },
          status: {
            type: 'string',
            description: 'New order status'
          },
          note: {
            type: 'string',
            description: 'Optional note for status change'
          }
        },
        required: ['orderNumber', 'status']
      }
    }
  ];
}

/**
 * Handle order tool execution
 */
export async function handleOrderTools(
  name: string,
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  switch (name) {
    case 'kibo_order_search':
      return handleOrderSearch(args, authService, config);
    case 'kibo_order_details':
      return handleOrderDetails(args, authService, config);
    case 'kibo_order_status_update':
      return handleOrderStatusUpdate(args, authService, config);
    default:
      throw new Error(`Unknown order tool: ${name}`);
  }
}

/**
 * Search for orders
 */
async function handleOrderSearch(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = OrderSearchSchema.parse(args);
  
  try {
    // Build query parameters
    const queryParams: any = {
      startIndex: params.startIndex,
      pageSize: params.pageSize,
    };

    // Build filter conditions
    const filters: string[] = [];

    if (params.customerEmailAddress) {
      filters.push(`customerAccount.emailAddress eq '${params.customerEmailAddress}'`);
    }

    if (params.status) {
      filters.push(`status eq '${params.status}'`);
    }

    if (params.orderNumber) {
      filters.push(`orderNumber eq '${params.orderNumber}'`);
    }

    if (params.startDate) {
      filters.push(`submittedDate ge datetime'${params.startDate}'`);
    }

    if (params.endDate) {
      filters.push(`submittedDate le datetime'${params.endDate}'`);
    }

    if (filters.length > 0) {
      queryParams.filter = filters.join(' and ');
    }

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }

    // Set response fields
    queryParams.responseFields = 'items(orderNumber,status,submittedDate,total,customerAccount,billingInfo,fulfillmentInfo),totalCount,pageCount,pageSize,startIndex';

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/orders`,
      params: queryParams,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              orders: response.items || [],
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
    console.error('Order search failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to search orders'
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get order details
 */
async function handleOrderDetails(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = OrderDetailSchema.parse(args);
  
  try {
    // Build response fields based on requested information
    const responseFields = [
      'orderNumber',
      'status',
      'submittedDate',
      'total',
      'subtotal',
      'taxTotal',
      'shippingTotal',
      'discountTotal',
      'customerAccount',
      'billingInfo',
      'fulfillmentInfo',
      'notes'
    ];

    if (params.includeItems) {
      responseFields.push('items');
    }

    if (params.includePayments) {
      responseFields.push('payments');
    }

    if (params.includeFulfillment) {
      responseFields.push('packages', 'shipments');
    }

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/orders/${encodeURIComponent(params.orderNumber)}`,
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
    console.error('Order details retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to retrieve order details for: ${params.orderNumber}`
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Update order status
 */
async function handleOrderStatusUpdate(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = OrderStatusUpdateSchema.parse(args);
  
  try {
    // First, get the current order to preserve existing data
    const currentOrder = await authService.request({
      method: 'GET',
      url: `/api/commerce/orders/${encodeURIComponent(params.orderNumber)}`,
    });

    // Prepare update payload
    const updateData = {
      ...currentOrder,
      status: params.status,
      auditInfo: {
        ...currentOrder.auditInfo,
        updateDate: new Date().toISOString(),
        updateBy: 'mcp-server'
      }
    };

    // Add note if provided
    if (params.note) {
      const newNote = {
        text: params.note,
        noteDate: new Date().toISOString(),
        noteBy: 'mcp-server'
      };
      
      updateData.notes = currentOrder.notes ? [...currentOrder.notes, newNote] : [newNote];
    }

    const response = await authService.request({
      method: 'PUT',
      url: `/api/commerce/orders/${encodeURIComponent(params.orderNumber)}`,
      data: updateData
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              orderNumber: response.orderNumber,
              oldStatus: currentOrder.status,
              newStatus: response.status,
              note: params.note,
              updatedDate: response.auditInfo && response.auditInfo.updateDate
            },
            message: `Order ${params.orderNumber} status updated from ${currentOrder.status} to ${params.status}`
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    console.error('Order status update failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to update status for order: ${params.orderNumber}`
          }, null, 2)
        }
      ]
    };
  }
}