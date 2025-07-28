"use strict";
/**
 * Kibo Commerce Product Management Tools
 *
 * MCP tools for product catalog operations including:
 * - Product search and retrieval
 * - Category management
 * - Product details and variants
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProductTools = registerProductTools;
exports.handleProductTools = handleProductTools;
var zod_1 = require("zod");
// Validation schemas
var ProductSearchSchema = zod_1.z.object({
    query: zod_1.z.string().optional().describe('Search query for product name, description, or SKU'),
    categoryCode: zod_1.z.string().optional().describe('Category code to filter products'),
    startIndex: zod_1.z.number().min(0).default(0).describe('Starting index for pagination'),
    pageSize: zod_1.z.number().min(1).max(200).default(20).describe('Number of products to return'),
    sortBy: zod_1.z.string().optional().describe('Sort field (e.g., "createDate desc", "productName asc")'),
    includeDetails: zod_1.z.boolean().default(false).describe('Include detailed product information'),
});
var ProductDetailSchema = zod_1.z.object({
    productCode: zod_1.z.string().describe('Product code or SKU to retrieve'),
    includeVariations: zod_1.z.boolean().default(true).describe('Include product variations'),
    includePricing: zod_1.z.boolean().default(true).describe('Include pricing information'),
    includeInventory: zod_1.z.boolean().default(true).describe('Include inventory levels'),
});
var CategorySearchSchema = zod_1.z.object({
    parentCategoryCode: zod_1.z.string().optional().describe('Parent category code to filter subcategories'),
    includeProducts: zod_1.z.boolean().default(false).describe('Include products in each category'),
    maxDepth: zod_1.z.number().min(1).max(5).default(3).describe('Maximum depth of category tree'),
});
/**
 * Register product-related MCP tools
 */
function registerProductTools() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
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
                ]];
        });
    });
}
/**
 * Handle product tool execution
 */
function handleProductTools(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (name) {
                case 'kibo_product_search':
                    return [2 /*return*/, handleProductSearch(args, authService, config)];
                case 'kibo_product_details':
                    return [2 /*return*/, handleProductDetails(args, authService, config)];
                case 'kibo_category_list':
                    return [2 /*return*/, handleCategoryList(args, authService, config)];
                default:
                    throw new Error("Unknown product tool: ".concat(name));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Search for products
 */
function handleProductSearch(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, responseFields, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = ProductSearchSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {
                        startIndex: params.startIndex,
                        pageSize: params.pageSize,
                    };
                    if (params.query) {
                        queryParams.q = params.query;
                    }
                    if (params.categoryCode) {
                        queryParams.filter = "categoryCode eq ".concat(params.categoryCode);
                    }
                    if (params.sortBy) {
                        queryParams.sortBy = params.sortBy;
                    }
                    responseFields = params.includeDetails
                        ? 'items(productCode,productName,description,price,salePrice,imageUrl,categoryId,variations,inventoryInfo,options),totalCount,pageCount,pageSize,startIndex'
                        : 'items(productCode,productName,price,salePrice,imageUrl,categoryId),totalCount,pageCount,pageSize,startIndex';
                    queryParams.responseFields = responseFields;
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/catalog/storefront/products",
                            params: queryParams,
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, {
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
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Product search failed:', error_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
                                        details: 'Failed to search products'
                                    }, null, 2)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get product details
 */
function handleProductDetails(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, responseFields, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = ProductDetailSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    responseFields = [
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
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/catalog/storefront/products/".concat(encodeURIComponent(params.productCode)),
                            params: {
                                responseFields: responseFields.join(',')
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: true,
                                        data: response
                                    }, null, 2)
                                }
                            ]
                        }];
                case 3:
                    error_2 = _a.sent();
                    console.error('Product details retrieval failed:', error_2);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_2 instanceof Error ? error_2.message : 'Unknown error occurred',
                                        details: "Failed to retrieve product details for: ".concat(params.productCode)
                                    }, null, 2)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get category list
 */
function handleCategoryList(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, responseFields, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = CategorySearchSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {};
                    if (params.parentCategoryCode) {
                        queryParams.filter = "parentCategoryCode eq ".concat(params.parentCategoryCode);
                    }
                    responseFields = [
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
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/catalog/storefront/categories",
                            params: queryParams,
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, {
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
                        }];
                case 3:
                    error_3 = _a.sent();
                    console.error('Category list retrieval failed:', error_3);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred',
                                        details: 'Failed to retrieve categories'
                                    }, null, 2)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
