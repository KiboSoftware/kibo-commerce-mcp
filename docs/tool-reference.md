# Tool Reference

Complete reference for all available Kibo Commerce MCP tools.

## Product Tools

### `kibo_product_search`

Search for products in the Kibo Commerce catalog with filtering and pagination options.

**Parameters:**
- `query` (string, optional) - Search query for product name, description, or SKU
- `categoryCode` (string, optional) - Category code to filter products
- `startIndex` (number, optional, default: 0) - Starting index for pagination
- `pageSize` (number, optional, default: 20, max: 200) - Number of products to return
- `sortBy` (string, optional) - Sort field (e.g., "createDate desc", "productName asc")
- `includeDetails` (boolean, optional, default: false) - Include detailed product information

**Example Usage:**
```
Search for products containing "laptop" with detailed information
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productCode": "LAPTOP-001",
        "productName": "Gaming Laptop",
        "price": 1299.99,
        "salePrice": 1199.99,
        "imageUrl": "https://...",
        "categoryId": 123
      }
    ],
    "pagination": {
      "totalCount": 50,
      "pageCount": 3,
      "pageSize": 20,
      "startIndex": 0
    }
  }
}
```

### `kibo_product_details`

Get detailed information about a specific product including variations, pricing, and inventory.

**Parameters:**
- `productCode` (string, required) - Product code or SKU to retrieve
- `includeVariations` (boolean, optional, default: true) - Include product variations
- `includePricing` (boolean, optional, default: true) - Include pricing information
- `includeInventory` (boolean, optional, default: true) - Include inventory levels

**Example Usage:**
```
Get detailed information for product "LAPTOP-001" including all variations and pricing
```

### `kibo_category_list`

Retrieve product categories and category tree structure.

**Parameters:**
- `parentCategoryCode` (string, optional) - Parent category code to filter subcategories
- `includeProducts` (boolean, optional, default: false) - Include products in each category
- `maxDepth` (number, optional, default: 3, max: 5) - Maximum depth of category tree

**Example Usage:**
```
List all categories under the "electronics" category
```

## Order Tools

### `kibo_order_search`

Search for orders with filtering options including customer email, status, and date range.

**Parameters:**
- `customerEmailAddress` (string, optional) - Customer email address to filter orders
- `status` (string, optional) - Order status (e.g., "Pending", "Processing", "Completed", "Cancelled")
- `startDate` (string, optional) - Start date for order search (ISO format)
- `endDate` (string, optional) - End date for order search (ISO format)
- `orderNumber` (string, optional) - Specific order number to search
- `startIndex` (number, optional, default: 0) - Starting index for pagination
- `pageSize` (number, optional, default: 20, max: 200) - Number of orders to return
- `sortBy` (string, optional) - Sort field (e.g., "orderDate desc", "orderNumber asc")

**Example Usage:**
```
Search for orders from customer "john@example.com" in the last 30 days
```

**Common Status Values:**
- `Pending` - Order submitted but not yet processed
- `Processing` - Order is being processed
- `Completed` - Order has been fulfilled
- `Cancelled` - Order has been cancelled
- `PartiallyFulfilled` - Some items have been shipped

### `kibo_order_details`

Get detailed information about a specific order including items, payments, and fulfillment.

**Parameters:**
- `orderNumber` (string, required) - Order number to retrieve
- `includeItems` (boolean, optional, default: true) - Include order line items
- `includePayments` (boolean, optional, default: true) - Include payment information
- `includeFulfillment` (boolean, optional, default: true) - Include fulfillment information

**Example Usage:**
```
Get complete details for order "ORD-12345" including all items and payment info
```

### `kibo_order_status_update`

Update the status of an order with optional notes.

**Parameters:**
- `orderNumber` (string, required) - Order number to update
- `status` (string, required) - New order status
- `note` (string, optional) - Optional note for status change

**Example Usage:**
```
Update order "ORD-12345" status to "Processing" with note "Order confirmed and being prepared"
```

## Customer Tools

### `kibo_customer_search`

Search for customers with filtering options including email, name, and status.

**Parameters:**
- `emailAddress` (string, optional) - Customer email address to search
- `firstName` (string, optional) - Customer first name
- `lastName` (string, optional) - Customer last name
- `customerNumber` (string, optional) - Customer account number
- `isActive` (boolean, optional) - Filter by active status
- `startIndex` (number, optional, default: 0) - Starting index for pagination
- `pageSize` (number, optional, default: 20, max: 200) - Number of customers to return
- `sortBy` (string, optional) - Sort field (e.g., "emailAddress asc", "lastName desc")

**Example Usage:**
```
Search for customers with last name "Smith" who are active
```

### `kibo_customer_details`

Get detailed information about a specific customer including attributes and contacts.

**Parameters:**
- `customerAccountId` (number, required) - Customer account ID to retrieve
- `includeAttributes` (boolean, optional, default: true) - Include customer attributes
- `includeContacts` (boolean, optional, default: true) - Include customer contacts
- `includeCards` (boolean, optional, default: false) - Include saved payment cards (sensitive)

**Example Usage:**
```
Get detailed information for customer ID 12345 including all attributes and contacts
```

### `kibo_customer_order_history`

Get order history for a specific customer with filtering options.

**Parameters:**
- `customerAccountId` (number, required) - Customer account ID
- `startDate` (string, optional) - Start date for order history (ISO format)
- `endDate` (string, optional) - End date for order history (ISO format)
- `status` (string, optional) - Filter by order status
- `startIndex` (number, optional, default: 0) - Starting index for pagination
- `pageSize` (number, optional, default: 20, max: 200) - Number of orders to return

**Example Usage:**
```
Get order history for customer 12345 for the last 6 months
```

## Inventory Tools

### `kibo_inventory_search`

Search inventory levels across products and locations with filtering options.

**Parameters:**
- `productCode` (string, optional) - Product code to check inventory
- `locationCode` (string, optional) - Location code to filter inventory
- `includeReserved` (boolean, optional, default: true) - Include reserved inventory quantities
- `includeAllocated` (boolean, optional, default: true) - Include allocated inventory quantities
- `startIndex` (number, optional, default: 0) - Starting index for pagination
- `pageSize` (number, optional, default: 50, max: 200) - Number of inventory records to return

**Example Usage:**
```
Search inventory for all products at location "WAREHOUSE-01"
```

### `kibo_inventory_details`

Get detailed inventory information for a specific product across all or specific locations.

**Parameters:**
- `productCode` (string, required) - Product code to get detailed inventory
- `locationCode` (string, optional) - Specific location code (if not provided, returns all locations)
- `includeHistory` (boolean, optional, default: false) - Include inventory transaction history

**Example Usage:**
```
Get detailed inventory for product "LAPTOP-001" at all locations with transaction history
```

### `kibo_stock_availability`

Check stock availability for multiple products at a specific location.

**Parameters:**
- `productCodes` (array of strings, required) - Array of product codes to check availability
- `locationCode` (string, optional) - Location code to check availability
- `quantity` (number, optional, default: 1, min: 1) - Quantity to check availability for

**Example Usage:**
```
Check availability for products ["LAPTOP-001", "MOUSE-002", "KEYBOARD-003"] quantity 2 each at location "STORE-001"
```

## Error Handling

All tools return responses in a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## Common Error Codes

- **400 Bad Request** - Invalid parameters or malformed request
- **401 Unauthorized** - Authentication failed, check credentials
- **403 Forbidden** - Insufficient permissions for the operation
- **404 Not Found** - Requested resource not found
- **429 Too Many Requests** - Rate limit exceeded, try again later
- **500 Internal Server Error** - Server error, try again later

## Best Practices

### Pagination
- Use pagination for large result sets to avoid timeouts
- Start with small page sizes (20-50) and increase if needed
- Always check `totalCount` to determine if more pages exist

### Filtering
- Use specific filters to reduce response size and improve performance
- Combine multiple filters with AND logic for precise results
- Use date ranges for time-based queries

### Error Handling
- Always check the `success` field in responses
- Log error details for debugging
- Implement retry logic for network errors
- Handle rate limiting with exponential backoff

### Performance
- Request only the fields you need using response field parameters
- Cache frequently accessed data when possible
- Use batch operations when available
- Avoid making too many concurrent requests