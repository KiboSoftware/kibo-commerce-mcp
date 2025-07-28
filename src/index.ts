#!/usr/bin/env node

/**
 * Kibo Commerce MCP Server
 * 
 * A Model Context Protocol server providing integration with Kibo Commerce platform.
 * Supports product management, order operations, customer management, and more.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

import { KiboAuthService } from './auth/auth-service.js';
import { registerProductTools } from './tools/product-tools.js';
import { registerOrderTools } from './tools/order-tools.js';
import { registerCustomerTools } from './tools/customer-tools.js';
import { registerInventoryTools } from './tools/inventory-tools.js';
import { KiboConfig } from './types/config.js';

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 */
function validateConfig(): KiboConfig {
  const requiredVars = [
    'KIBO_API_HOST',
    'KIBO_CLIENT_ID',
    'KIBO_CLIENT_SECRET',
    'KIBO_TENANT_ID',
    'KIBO_SITE_ID'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    apiHost: process.env.KIBO_API_HOST!,
    clientId: process.env.KIBO_CLIENT_ID!,
    clientSecret: process.env.KIBO_CLIENT_SECRET!,
    tenantId: parseInt(process.env.KIBO_TENANT_ID!),
    siteId: parseInt(process.env.KIBO_SITE_ID!),
    masterCatalogId: process.env.KIBO_MASTER_CATALOG_ID ? parseInt(process.env.KIBO_MASTER_CATALOG_ID) : undefined,
    locale: process.env.KIBO_LOCALE || 'en-US',
    currency: process.env.KIBO_CURRENCY || 'USD',
    logLevel: process.env.MCP_LOG_LEVEL || 'info'
  };
}

/**
 * Create and configure the MCP server
 */
async function createServer(): Promise<Server> {
  const config = validateConfig();
  const authService = new KiboAuthService(config);
  
  const server = new Server(
    {
      name: 'kibo-commerce-mcp',
      version: '0.1.0',
    }
  );

  // Initialize authentication
  try {
    await authService.initialize();
  } catch (error) {
    console.error('Failed to initialize Kibo authentication:', error);
    throw error;
  }

  // Register tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // Product tools will be registered here
        ...await registerProductTools(),
        // Order tools will be registered here
        ...await registerOrderTools(),
        // Customer tools will be registered here
        ...await registerCustomerTools(),
        // Inventory tools will be registered here
        ...await registerInventoryTools(),
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      // Route tool calls to appropriate handlers
      if (name.startsWith('kibo_product_')) {
        return await handleProductTool(name, args, authService, config);
      } else if (name.startsWith('kibo_order_')) {
        return await handleOrderTool(name, args, authService, config);
      } else if (name.startsWith('kibo_customer_')) {
        return await handleCustomerTool(name, args, authService, config);
      } else if (name.startsWith('kibo_inventory_')) {
        return await handleInventoryTool(name, args, authService, config);
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
      }
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  return server;
}

/**
 * Tool handler functions (to be imported from tool modules)
 */
async function handleProductTool(name: string, args: any, authService: KiboAuthService, config: KiboConfig): Promise<any> {
  const { handleProductTools } = await import('./tools/product-tools.js');
  return handleProductTools(name, args, authService, config);
}

async function handleOrderTool(name: string, args: any, authService: KiboAuthService, config: KiboConfig): Promise<any> {
  const { handleOrderTools } = await import('./tools/order-tools.js');
  return handleOrderTools(name, args, authService, config);
}

async function handleCustomerTool(name: string, args: any, authService: KiboAuthService, config: KiboConfig): Promise<any> {
  const { handleCustomerTools } = await import('./tools/customer-tools.js');
  return handleCustomerTools(name, args, authService, config);
}

async function handleInventoryTool(name: string, args: any, authService: KiboAuthService, config: KiboConfig): Promise<any> {
  const { handleInventoryTools } = await import('./tools/inventory-tools.js');
  return handleInventoryTools(name, args, authService, config);
}

/**
 * Main function to start the server
 */
async function main(): Promise<void> {
  try {
    const server = await createServer();
    const transport = new StdioServerTransport();
    
    console.error('Kibo Commerce MCP Server starting...');
    
    await server.connect(transport);
    console.error('Kibo Commerce MCP Server connected and ready!');
  } catch (error) {
    console.error('Failed to start Kibo Commerce MCP Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down Kibo Commerce MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down Kibo Commerce MCP Server...');
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}