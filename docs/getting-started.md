# Getting Started with Kibo Commerce MCP Server

This guide will help you set up and configure the Kibo Commerce MCP (Model Context Protocol) server for integration with Claude Desktop and other MCP-compatible clients.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed on your system
- **Kibo Commerce tenant** with API access
- **Application credentials** from your Kibo Commerce Admin
- **Claude Desktop** or another MCP-compatible client

## Installation

### Option 1: NPX (Recommended)

No installation required! NPX will automatically download and run the latest version.

### Option 2: Local Development

```bash
git clone https://github.com/kibocommerce/kibo-commerce-mcp.git
cd kibo-commerce-mcp
npm install
npm run build
```

## Configuration

### 1. Get Your Kibo Commerce Credentials

1. Log into your Kibo Commerce Admin Console
2. Navigate to **System** > **Applications**
3. Create a new application or use an existing one
4. Note down the following information:
   - **Application ID** (Client ID)
   - **Shared Secret** (Client Secret)
   - **Tenant ID**
   - **Site ID**
   - **API Host URL** (e.g., `https://t{tenant}.sandbox.mozu.com`)

### 2. Create Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Kibo Commerce API Configuration
KIBO_API_HOST=https://t12345.sandbox.mozu.com
KIBO_CLIENT_ID=your_application_id
KIBO_CLIENT_SECRET=your_shared_secret
KIBO_TENANT_ID=12345
KIBO_SITE_ID=67890

# Optional Configuration
KIBO_MASTER_CATALOG_ID=1
KIBO_LOCALE=en-US
KIBO_CURRENCY=USD
MCP_LOG_LEVEL=info
```

## Claude Desktop Integration

### 1. Install the MCP Server

Add the Kibo Commerce MCP server to your Claude Desktop configuration:

**macOS/Linux:**
```bash
# Edit Claude Desktop config
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
# Edit Claude Desktop config
code %APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add MCP Server Configuration

### NPX Configuration

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "npx",
      "args": ["@kibocommerce/kibo-commerce-mcp"],
      "env": {
        "KIBO_API_HOST": "https://t12345.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id",
        "KIBO_CLIENT_SECRET": "your_shared_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

### Local Development Configuration

```json
{
  "mcpServers": {
    "kibo-commerce": {
      "command": "node",
      "args": ["/path/to/kibo-commerce-mcp/dist/index.js"],
      "env": {
        "KIBO_API_HOST": "https://t12345.sandbox.mozu.com",
        "KIBO_CLIENT_ID": "your_application_id",
        "KIBO_CLIENT_SECRET": "your_shared_secret",
        "KIBO_TENANT_ID": "12345",
        "KIBO_SITE_ID": "67890"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Close and restart Claude Desktop to load the new MCP server.

## Quick Test

### 1. Verify Connection

Start a conversation in Claude Desktop and try:

```
Search for products containing "shirt"
```

### 2. Test Product Search

```
Use kibo_product_search to find products with the query "blue" and include detailed information
```

### 3. Test Order Lookup

```
Search for orders from customer with email "customer@example.com"
```

## Available Tools

Once configured, you'll have access to these tools in Claude:

### Product Tools
- **`kibo_product_search`** - Search for products with filtering options
- **`kibo_product_details`** - Get detailed product information
- **`kibo_category_list`** - Retrieve product categories

### Order Tools  
- **`kibo_order_search`** - Search for orders with various filters
- **`kibo_order_details`** - Get detailed order information
- **`kibo_order_status_update`** - Update order status

### Customer Tools
- **`kibo_customer_search`** - Search for customers
- **`kibo_customer_details`** - Get detailed customer information  
- **`kibo_customer_order_history`** - Get customer order history

### Inventory Tools
- **`kibo_inventory_search`** - Search inventory levels
- **`kibo_inventory_details`** - Get detailed inventory for a product
- **`kibo_stock_availability`** - Check stock availability

## Common Issues

### Authentication Errors

**Problem:** `Authentication failed` or `401 Unauthorized`

**Solutions:**
- Verify your Client ID and Client Secret are correct
- Ensure your application has the necessary permissions in Kibo Admin
- Check that your Tenant ID and Site ID are correct
- Verify the API Host URL is correct for your environment

### Network Errors

**Problem:** `Network error` or connection timeouts

**Solutions:**
- Check your internet connection
- Verify the API Host URL is accessible
- Try testing the API directly with a tool like Postman
- Check if your firewall is blocking the connection

### Permission Errors

**Problem:** `403 Forbidden` errors

**Solutions:**
- Verify your application has the necessary API permissions
- Check that your user account has access to the requested resources
- Ensure you're using the correct Site ID for the operation

### Missing Data

**Problem:** Empty results or missing fields

**Solutions:**
- Verify data exists in your Kibo Commerce tenant
- Check that you're searching in the correct site/catalog
- Try different search parameters
- Verify your Master Catalog ID if using multi-catalog setup

## Development Mode

For development and testing:

```bash
# Start in development mode with auto-rebuild
npm run dev

# Run the server directly
npm start

# Check for code issues
npm run lint
```

## Next Steps

- Review the [Tool Reference](./tool-reference.md) for detailed tool documentation
- Check out [Examples](./examples.md) for common use cases
- See [Best Practices](./best-practices.md) for optimization tips
- Learn about [Configuration Options](./configuration.md) for advanced setup

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the server logs for detailed error messages
3. Verify your Kibo Commerce API access independently
4. Create an issue on the [GitHub repository](https://github.com/kibocommerce/kibo-commerce-mcp/issues) with detailed information