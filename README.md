# Kibo Commerce MCP Server

A Model Context Protocol (MCP) server providing seamless integration with Kibo Commerce platform through their TypeScript SDK.

[![npm version](https://badge.fury.io/js/@kibocommerce%2Fkibo-commerce-mcp.svg)](https://badge.fury.io/js/@kibocommerce%2Fkibo-commerce-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Features

- **🛍️ Product Management**: Search, retrieve, and analyze product catalogs with advanced filtering
- **📦 Order Operations**: Complete order lifecycle management from search to fulfillment
- **👥 Customer Management**: Comprehensive customer data access and order history
- **📊 Inventory Operations**: Real-time inventory tracking across multiple locations
- **🔧 Site Configuration**: Access to site settings and configuration data
- **🔐 Secure Authentication**: OAuth2 with automatic token refresh and management
- **📱 Multi-tenant Support**: Support for multiple Kibo Commerce environments

## Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Kibo Commerce** tenant with API access
- **Claude Desktop** or compatible MCP client

### Installation

#### Option 1: NPX (Recommended - No Installation Required)

No installation needed! NPX automatically downloads and runs the latest version from npm registry.

**Benefits:**
- ✅ Always uses the latest version
- ✅ No global package pollution
- ✅ Works immediately without setup
- ✅ Automatic updates

#### Option 2: NPM Global Install

```bash
npm install -g @kibocommerce/kibo-commerce-mcp
```

#### Option 3: Clone and Build

```bash
git clone https://github.com/kibocommerce/kibo-commerce-mcp.git
cd kibo-commerce-mcp
npm install
npm run build
```

### Configuration

1. **Get Kibo Commerce Credentials**
   - Log into your Kibo Commerce Admin Console
   - Navigate to **System** > **Applications**  
   - Create or use existing application credentials
   - Note: Client ID, Client Secret, Tenant ID, Site ID, API Host

2. **Environment Setup**

Create a `.env` file:

```env
KIBO_API_HOST=https://t{tenant}.sandbox.mozu.com
KIBO_CLIENT_ID=your_application_id
KIBO_CLIENT_SECRET=your_shared_secret  
KIBO_TENANT_ID=12345
KIBO_SITE_ID=67890
KIBO_MASTER_CATALOG_ID=1
KIBO_LOCALE=en-US
KIBO_CURRENCY=USD
```

### Claude Desktop Setup

#### Configuration File Locations

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Option 1: NPX (Recommended)

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "npx",
      "args": ["@kibocommerce/kibo-commerce-mcp"],
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id",
        "KIBO_CLIENT_SECRET": "your_shared_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

#### Option 2: NPM Global Install

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "kibo-commerce-mcp",
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id",
        "KIBO_CLIENT_SECRET": "your_shared_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

#### Option 3: Local Development

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "node",
      "args": ["/absolute/path/to/kibo-commerce-mcp/dist/index.js"],
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id", 
        "KIBO_CLIENT_SECRET": "your_shared_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

#### Option 4: Multiple Environments

```json
{
  "mcpServers": {
    "kibo-production": {
      "command": "npx",
      "args": ["@kibocommerce/kibo-commerce-mcp"],
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.mozu.com",
        "KIBO_CLIENT_ID": "prod_client_id",
        "KIBO_CLIENT_SECRET": "prod_client_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    },
    "kibo-sandbox": {
      "command": "npx",
      "args": ["@kibocommerce/kibo-commerce-mcp"],
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "sandbox_client_id",
        "KIBO_CLIENT_SECRET": "sandbox_client_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

### Testing the Connection

1. **Restart Claude Desktop** after configuration changes
2. **First-time NPX users**: The first run may take a few seconds to download the package
3. **Test with a simple query**:
   ```
   Search for products containing "shirt" 
   ```
4. **Verify tools are loaded**:
   ```
   What Kibo Commerce tools are available?
   ```

## Available Tools

### 🛍️ Product Operations
- **`kibo_product_search`** - Search products with advanced filtering, pagination, and sorting
- **`kibo_product_details`** - Get detailed product information including variations, pricing, and inventory
- **`kibo_category_list`** - Retrieve product categories and category tree structure

### 📦 Order Operations  
- **`kibo_order_search`** - Search orders by customer, status, date range with pagination
- **`kibo_order_details`** - Get complete order information including items, payments, and fulfillment
- **`kibo_order_status_update`** - Update order status with optional notes and audit trail

### 👥 Customer Operations
- **`kibo_customer_search`** - Search customers with filtering by email, name, and status
- **`kibo_customer_details`** - Get detailed customer profiles including attributes and contacts
- **`kibo_customer_order_history`** - Retrieve complete customer order history with filtering

### 📊 Inventory Operations
- **`kibo_inventory_search`** - Search inventory levels across products and locations
- **`kibo_inventory_details`** - Get detailed inventory information with transaction history
- **`kibo_stock_availability`** - Check stock availability for multiple products

## Example Usage

### Product Search
```
Find all laptops under $2000 in the electronics category, sorted by price
```

### Order Management  
```
Show me all pending orders from the last 7 days that need immediate attention
```

### Customer Service
```
Look up customer "john@example.com" and show their order history from the last 6 months
```

### Inventory Analysis
```
Check inventory levels for products "SKU-001", "SKU-002", "SKU-003" at warehouse location "WH-MAIN"
```

## Troubleshooting

### Common Issues

#### Authentication Errors
- **401 Unauthorized**: Check Client ID/Secret and ensure application permissions
- **403 Forbidden**: Verify user account has access to requested resources  
- **Invalid Host**: Ensure API Host URL matches your environment (sandbox vs production)

#### Network Issues
- **Connection Timeout**: Check firewall/proxy settings
- **DNS Resolution**: Verify API host URL is accessible
- **SSL Issues**: Ensure valid certificates for HTTPS connections

#### Tool Errors
- **Tool Not Found**: Restart Claude Desktop after configuration changes
- **Empty Results**: Verify data exists in your Kibo Commerce tenant
- **Permission Denied**: Check application API permissions in Kibo Admin

### Debug Mode

Enable detailed logging:

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "npx",
      "args": ["@kibocommerce/kibo-commerce-mcp"],
      "env": {
        "KIBO_API_HOST": "https://t{tenant}.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id",
        "KIBO_CLIENT_SECRET": "your_shared_secret", 
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890",
        "MCP_LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Support

- 📚 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/kibocommerce/kibo-commerce-mcp/issues)
- 💬 [Discussions](https://github.com/kibocommerce/kibo-commerce-mcp/discussions)

## Development

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/kibocommerce/kibo-commerce-mcp.git
cd kibo-commerce-mcp

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Build and test
npm run build
npm test

# Development mode with auto-rebuild
npm run dev
```

### Project Structure

```
kibo-commerce-mcp/
├── src/
│   ├── auth/           # Authentication services
│   ├── tools/          # MCP tool implementations  
│   ├── types/          # TypeScript type definitions
│   ├── services/       # Kibo API service wrappers
│   └── index.ts        # Main server entry point
├── docs/               # Documentation
├── examples/           # Usage examples
├── tests/              # Test suite
└── dist/               # Built JavaScript (generated)
```

### Adding New Tools

1. Create tool implementation in `src/tools/`
2. Add tool registration in `src/index.ts`
3. Update type definitions in `src/types/`
4. Add tests in `tests/`
5. Update documentation

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
npm run lint:fix
```

### Publishing for NPX Usage

To make the package available for npx usage:

```bash
# Build the package
npm run build

# Publish to npm registry
npm publish

# Users can then run with npx
npx @kibocommerce/kibo-commerce-mcp
```

**Note**: The package must be published to npm registry for npx to work. For development, use the local development option in Claude Desktop configuration.

## API Reference

### Authentication
- **OAuth2** client credentials flow
- **Automatic token refresh** with 5-minute buffer
- **Multi-tenant support** with context headers
- **Secure credential management**

### Rate Limiting
- **Automatic retry** with exponential backoff
- **Request queuing** for high-volume operations
- **Error handling** for rate limit exceeded responses

### Data Models
- **Comprehensive TypeScript types** for all Kibo Commerce entities
- **Validation schemas** using Zod for runtime type checking
- **Consistent response formatting** across all tools

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** with strict type checking
- **ESLint** with recommended rules
- **Jest** for testing with 80%+ coverage
- **Conventional Commits** for commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Kibo Commerce](https://kibocommerce.com/) for the e-commerce platform
- [Model Context Protocol](https://modelcontextprotocol.io/) for the integration framework
- [Anthropic](https://anthropic.com/) for Claude Desktop and MCP ecosystem