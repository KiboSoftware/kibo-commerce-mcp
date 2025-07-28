/**
 * Kibo Commerce Customer Management Tools
 * 
 * MCP tools for customer operations including:
 * - Customer search and retrieval
 * - Customer account management
 * - Customer order history
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { KiboAuthService } from '../auth/auth-service.js';
import { KiboConfig } from '../types/config.js';
import { z } from 'zod';

// Validation schemas
const CustomerSearchSchema = z.object({
  emailAddress: z.string().optional().describe('Customer email address to search'),
  firstName: z.string().optional().describe('Customer first name'),
  lastName: z.string().optional().describe('Customer last name'),
  customerNumber: z.string().optional().describe('Customer account number'),
  isActive: z.boolean().optional().describe('Filter by active status'),
  startIndex: z.number().min(0).default(0).describe('Starting index for pagination'),
  pageSize: z.number().min(1).max(200).default(20).describe('Number of customers to return'),
  sortBy: z.string().optional().describe('Sort field (e.g., "emailAddress asc", "lastName desc")'),
});

const CustomerDetailSchema = z.object({
  customerAccountId: z.number().describe('Customer account ID to retrieve'),
  includeAttributes: z.boolean().default(true).describe('Include customer attributes'),
  includeContacts: z.boolean().default(true).describe('Include customer contacts'),
  includeCards: z.boolean().default(false).describe('Include saved payment cards (sensitive)'),
});

const CustomerOrderHistorySchema = z.object({
  customerAccountId: z.number().describe('Customer account ID'),
  startDate: z.string().optional().describe('Start date for order history (ISO format)'),
  endDate: z.string().optional().describe('End date for order history (ISO format)'),
  status: z.string().optional().describe('Filter by order status'),
  startIndex: z.number().min(0).default(0).describe('Starting index for pagination'),
  pageSize: z.number().min(1).max(200).default(20).describe('Number of orders to return'),
});

/**
 * Register customer-related MCP tools
 */
export async function registerCustomerTools(): Promise<Tool[]> {
  return [
    {
      name: 'kibo_customer_search',
      description: 'Search for customers with filtering options including email, name, and status',
      inputSchema: {
        type: 'object',
        properties: {
          emailAddress: {
            type: 'string',
            description: 'Customer email address to search'
          },
          firstName: {
            type: 'string',
            description: 'Customer first name'
          },
          lastName: {
            type: 'string',
            description: 'Customer last name'
          },
          customerNumber: {
            type: 'string',
            description: 'Customer account number'
          },
          isActive: {
            type: 'boolean',
            description: 'Filter by active status'
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
            description: 'Number of customers to return'
          },
          sortBy: {
            type: 'string',
            description: 'Sort field (e.g., "emailAddress asc", "lastName desc")'
          }
        }
      }
    },
    {
      name: 'kibo_customer_details',
      description: 'Get detailed information about a specific customer including attributes and contacts',
      inputSchema: {
        type: 'object',
        properties: {
          customerAccountId: {
            type: 'number',
            description: 'Customer account ID to retrieve'
          },
          includeAttributes: {
            type: 'boolean',
            default: true,
            description: 'Include customer attributes'
          },
          includeContacts: {
            type: 'boolean',
            default: true,
            description: 'Include customer contacts'
          },
          includeCards: {
            type: 'boolean',
            default: false,
            description: 'Include saved payment cards (sensitive)'
          }
        },
        required: ['customerAccountId']
      }
    },
    {
      name: 'kibo_customer_order_history',
      description: 'Get order history for a specific customer with filtering options',
      inputSchema: {
        type: 'object',
        properties: {
          customerAccountId: {
            type: 'number',
            description: 'Customer account ID'
          },
          startDate: {
            type: 'string',
            description: 'Start date for order history (ISO format)'
          },
          endDate: {
            type: 'string',
            description: 'End date for order history (ISO format)'
          },
          status: {
            type: 'string',
            description: 'Filter by order status'
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
          }
        },
        required: ['customerAccountId']
      }
    }
  ];
}

/**
 * Handle customer tool execution
 */
export async function handleCustomerTools(
  name: string,
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  switch (name) {
    case 'kibo_customer_search':
      return handleCustomerSearch(args, authService, config);
    case 'kibo_customer_details':
      return handleCustomerDetails(args, authService, config);
    case 'kibo_customer_order_history':
      return handleCustomerOrderHistory(args, authService, config);
    default:
      throw new Error(`Unknown customer tool: ${name}`);
  }
}

/**
 * Search for customers
 */
async function handleCustomerSearch(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = CustomerSearchSchema.parse(args);
  
  try {
    // Build query parameters
    const queryParams: any = {
      startIndex: params.startIndex,
      pageSize: params.pageSize,
    };

    // Build filter conditions
    const filters: string[] = [];

    if (params.emailAddress) {
      filters.push(`emailAddress eq '${params.emailAddress}'`);
    }

    if (params.firstName) {
      filters.push(`firstName eq '${params.firstName}'`);
    }

    if (params.lastName) {
      filters.push(`lastName eq '${params.lastName}'`);
    }

    if (params.customerNumber) {
      filters.push(`customerNumber eq '${params.customerNumber}'`);
    }

    if (params.isActive !== undefined) {
      filters.push(`isActive eq ${params.isActive}`);
    }

    if (filters.length > 0) {
      queryParams.filter = filters.join(' and ');
    }

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }

    // Set response fields for customer search
    queryParams.responseFields = 'items(id,customerNumber,emailAddress,firstName,lastName,isActive,customerType,auditInfo),totalCount,pageCount,pageSize,startIndex';

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/customer/accounts`,
      params: queryParams,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              customers: response.items || [],
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
    console.error('Customer search failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: 'Failed to search customers'
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get customer details
 */
async function handleCustomerDetails(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = CustomerDetailSchema.parse(args);
  
  try {
    // Build response fields based on requested information
    const responseFields = [
      'id',
      'customerNumber',
      'emailAddress',
      'firstName',
      'lastName',
      'middleNameOrInitial',
      'companyOrOrganization',
      'customerType',
      'isActive',
      'acceptsMarketing',
      'hasExternalPassword',
      'isAnonymous',
      'auditInfo'
    ];

    if (params.includeAttributes) {
      responseFields.push('attributes');
    }

    if (params.includeContacts) {
      responseFields.push('contacts');
    }

    if (params.includeCards) {
      responseFields.push('cards');
    }

    const response = await authService.request({
      method: 'GET',
      url: `/api/commerce/customer/accounts/${params.customerAccountId}`,
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
    console.error('Customer details retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to retrieve customer details for ID: ${params.customerAccountId}`
          }, null, 2)
        }
      ]
    };
  }
}

/**
 * Get customer order history
 */
async function handleCustomerOrderHistory(
  args: any,
  authService: KiboAuthService,
  config: KiboConfig
): Promise<any> {
  const params = CustomerOrderHistorySchema.parse(args);
  
  try {
    // Build query parameters
    const queryParams: any = {
      startIndex: params.startIndex,
      pageSize: params.pageSize,
    };

    // Build filter conditions
    const filters: string[] = [
      `customerAccountId eq ${params.customerAccountId}`
    ];

    if (params.status) {
      filters.push(`status eq '${params.status}'`);
    }

    if (params.startDate) {
      filters.push(`submittedDate ge datetime'${params.startDate}'`);
    }

    if (params.endDate) {
      filters.push(`submittedDate le datetime'${params.endDate}'`);
    }

    queryParams.filter = filters.join(' and ');

    // Set response fields for order history
    queryParams.responseFields = 'items(orderNumber,status,submittedDate,total,subtotal,taxTotal,shippingTotal,items),totalCount,pageCount,pageSize,startIndex';
    queryParams.sortBy = 'submittedDate desc';

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
    console.error('Customer order history retrieval failed:', error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            details: `Failed to retrieve order history for customer ID: ${params.customerAccountId}`
          }, null, 2)
        }
      ]
    };
  }
}