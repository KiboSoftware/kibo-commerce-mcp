# Claude Prompts and Examples

This document provides example prompts you can use with Claude Desktop once the Kibo Commerce MCP server is configured.

## Product Management Examples

### Basic Product Search

```
Search for all products containing "laptop" in the name or description
```

### Advanced Product Search

```
Find products in the "electronics" category, sort by creation date (newest first), and show detailed information including variations and pricing
```

### Product Details Lookup

```
Get complete details for product code "LAPTOP-GAMING-001" including all variations, pricing tiers, and current inventory levels
```

### Category Browsing

```
Show me the category tree starting from "computers" category, including all subcategories and the count of products in each
```

### AI-Powered Product Enrichment 🤖

> **⚠️ Note:** These examples use write operations that require admin API credentials.

#### Single Product Description Enhancement

```
Look up product "LAPTOP-001", then enhance its product description with the following:
1. Highlight the key features in engaging language
2. Add benefits-focused content (not just features)
3. Include SEO-optimized keywords naturally
4. Format with proper HTML structure
5. Update the product with the enhanced description and note it as "AI content enrichment"
```

#### Bulk Product SEO Optimization

```
Search for products in the "electronics" category that have short descriptions under 50 characters. For the first 5 products:
1. Generate compelling meta descriptions (150-160 characters)
2. Create relevant meta keywords
3. Craft SEO-friendly meta titles
4. Update each product with the new SEO metadata
5. Summarize the changes made
```

#### Product Content Translation and Localization

```
Get details for product "WIDGET-PRO-500" and:
1. Analyze the current product description
2. Rewrite it to be more appealing to a technical B2B audience
3. Add technical specifications in a structured format
4. Include industry-specific terminology
5. Update the product with the localized content
```

#### Price-Conscious Description Updates

```
Find products with sale prices, then:
1. Update their short descriptions to highlight the savings
2. Add urgency language like "Limited time offer"
3. Include the discount percentage prominently
4. Keep descriptions under 100 characters for mobile optimization
5. Update each product and track the changes
```

#### New Product Creation from Specifications

```
I'll provide product specifications. Create a new product with:
- Product Code: GEN-AI-WIDGET-001
- Name: AI-Generated Smart Widget
- Generate a compelling full description based on these specs: [wireless, IoT-enabled, battery-powered, smart home compatible]
- Create an SEO-optimized short description
- Set price at $149.99
- Add appropriate meta tags for search visibility
```

#### Content Audit and Enhancement

```
Search for products created before 2024-01-01. For products with descriptions shorter than 100 characters:
1. Identify what information is missing
2. Generate comprehensive descriptions
3. Add relevant keywords
4. Show me the proposed changes before updating
5. After approval, update the products with enhanced content
```

#### Competitive Analysis-Based Updates

```
I'll describe a competitor's product. Analyze it and:
1. Find our similar product by searching for [keyword]
2. Compare our description to the competitor's strengths
3. Enhance our product description to highlight our advantages
4. Add unique selling propositions
5. Update the product with competitive positioning
```

## Order Management Examples

### Order Search by Customer

```
Find all orders for customer with email "john.doe@example.com" from the last 30 days, sorted by order date
```

### Order Search by Status

```
Show me all "Pending" orders from today that need to be processed
```

### Order Details Investigation

```
Get complete details for order "ORD-2024-001234" including all line items, payment information, and shipping details
```

### Order Status Updates

```
Update order "ORD-2024-001234" status to "Processing" and add a note saying "Order confirmed and being prepared for shipment"
```

### Bulk Order Analysis

```
Find all "Completed" orders from last week and summarize the total sales volume and most popular products
```

## Customer Service Examples

### Customer Lookup

```
Find the customer account for email address "jane.smith@email.com" and show their contact information and account status
```

### Customer Order History

```
Show me the complete order history for customer ID 12345 from the last 6 months, including order totals and status
```

### Customer Profile Investigation

```
Get detailed information for customer account 12345 including all attributes, contact information, and saved payment methods
```

### Customer Account Research

```
Search for customers with last name "Johnson" who are active and have placed orders in the last year
```

## Inventory Management Examples

### Stock Level Check

```
Check current inventory levels for product "SKU-12345" across all warehouse locations
```

### Multi-Product Availability

```
Check if we have at least 5 units available for each of these products: "LAPTOP-001", "MOUSE-002", "KEYBOARD-003" at location "WAREHOUSE-MAIN"
```

### Inventory Search by Location

```
Show me all products with low inventory (less than 10 units) at location "STORE-NYC"
```

### Detailed Inventory Analysis

```
Get detailed inventory information for product "BESTSELLER-001" including transaction history to understand recent stock movements
```

## Advanced Analysis Examples

### Sales Performance Analysis

```
Analyze sales performance by:
1. Finding all completed orders from last month
2. Identifying the top 10 best-selling products
3. Calculating total revenue and average order value
4. Showing which products have the highest profit margins
```

### Customer Behavior Analysis

```
Create a customer analysis report:
1. Find customers who have placed orders in the last 90 days
2. Calculate their average order value and frequency
3. Identify customers who haven't ordered recently but were active before
4. Suggest which customers might need re-engagement campaigns
```

### Inventory Optimization

```
Help optimize inventory by:
1. Finding products with high inventory levels but low recent sales
2. Identifying fast-moving products that might need restocking
3. Checking for products with inventory in multiple locations
4. Suggesting which products to promote or discontinue
```

### Order Fulfillment Monitoring

```
Create an order fulfillment dashboard:
1. Show all orders that are "Processing" for more than 2 days
2. Identify orders with shipping delays
3. Find orders that need immediate attention
4. Calculate average fulfillment time by product category
```

## Troubleshooting Examples

### Data Verification

```
Help me verify data consistency:
1. Check if product "SKU-12345" exists in the catalog
2. Verify its current inventory levels
3. Find any recent orders containing this product
4. Check if there are any fulfillment issues
```

### Customer Issue Investigation

```
A customer (email: support@customer.com) is asking about their order. Help me:
1. Find their customer account
2. Show their recent order history
3. Get details about their most recent order
4. Check if there are any fulfillment or payment issues
```

### System Health Check

```
Perform a system health check:
1. Search for products to test catalog access
2. Look up recent orders to verify order system
3. Check customer accounts to ensure customer system is working
4. Verify inventory data is accessible
```

## Multi-Step Workflows

### New Product Launch Preparation

```
Help me prepare for a new product launch:
1. Check if the product code "NEW-PRODUCT-001" already exists
2. Verify the target category "new-arrivals" is available
3. Check inventory setup at all locations
4. Look for similar products to understand pricing strategy
```

### Customer Service Investigation

```
A customer called about a missing order. Help me investigate:
1. Find their customer account using email "concerned@customer.com"
2. Get their recent order history
3. Find details about any pending or recent orders
4. Check if there are inventory or fulfillment issues with ordered products
```

### Promotional Campaign Analysis

```
Analyze the effectiveness of our recent promotion:
1. Find all orders placed during the promotional period (last 2 weeks)
2. Identify which promoted products had the most sales
3. Calculate the impact on inventory levels
4. Determine which customer segments responded best
```

## Tips for Effective Prompts

### Be Specific
Instead of: "Find some orders"
Use: "Find all orders with status 'Pending' from the last 7 days"

### Include Context
Instead of: "Check inventory"
Use: "Check inventory levels for product 'LAPTOP-001' to determine if we can fulfill a large order of 50 units"

### Ask for Analysis
Instead of: "Show me customer data"
Use: "Analyze customer purchasing patterns for customers who bought 'PREMIUM-WIDGET' to identify potential upsell opportunities"

### Chain Operations
```
Help me with this workflow:
1. First, find the customer with email "vip@customer.com"
2. Then get their order history from the last year
3. Identify their most frequently purchased products
4. Check current inventory for those products
5. Suggest products they might be interested in based on their history
```

### Request Summaries
```
Create a daily operations summary:
1. Count of new orders from today
2. List of orders that need immediate attention
3. Products with critically low inventory
4. Summary of customer service issues that need follow-up
```