"use strict";
/**
 * Kibo Commerce Inventory Management Tools
 *
 * MCP tools for inventory operations including:
 * - Inventory level queries
 * - Stock availability checks
 * - Inventory updates (if permissions allow)
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
exports.registerInventoryTools = registerInventoryTools;
exports.handleInventoryTools = handleInventoryTools;
var zod_1 = require("zod");
// Validation schemas
var InventorySearchSchema = zod_1.z.object({
    productCode: zod_1.z.string().optional().describe('Product code to check inventory'),
    locationCode: zod_1.z.string().optional().describe('Location code to filter inventory'),
    includeReserved: zod_1.z.boolean().default(true).describe('Include reserved inventory quantities'),
    includeAllocated: zod_1.z.boolean().default(true).describe('Include allocated inventory quantities'),
    startIndex: zod_1.z.number().min(0).default(0).describe('Starting index for pagination'),
    pageSize: zod_1.z.number().min(1).max(200).default(50).describe('Number of inventory records to return'),
});
var InventoryDetailSchema = zod_1.z.object({
    productCode: zod_1.z.string().describe('Product code to get detailed inventory'),
    locationCode: zod_1.z.string().optional().describe('Specific location code (if not provided, returns all locations)'),
    includeHistory: zod_1.z.boolean().default(false).describe('Include inventory transaction history'),
});
var StockAvailabilitySchema = zod_1.z.object({
    productCodes: zod_1.z.array(zod_1.z.string()).describe('Array of product codes to check availability'),
    locationCode: zod_1.z.string().optional().describe('Location code to check availability'),
    quantity: zod_1.z.number().min(1).default(1).describe('Quantity to check availability for'),
});
/**
 * Register inventory-related MCP tools
 */
function registerInventoryTools() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
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
                ]];
        });
    });
}
/**
 * Handle inventory tool execution
 */
function handleInventoryTools(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (name) {
                case 'kibo_inventory_search':
                    return [2 /*return*/, handleInventorySearch(args, authService, config)];
                case 'kibo_inventory_details':
                    return [2 /*return*/, handleInventoryDetails(args, authService, config)];
                case 'kibo_stock_availability':
                    return [2 /*return*/, handleStockAvailability(args, authService, config)];
                default:
                    throw new Error("Unknown inventory tool: ".concat(name));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Search inventory levels
 */
function handleInventorySearch(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, filters, responseFields, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = InventorySearchSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {
                        startIndex: params.startIndex,
                        pageSize: params.pageSize,
                    };
                    filters = [];
                    if (params.productCode) {
                        filters.push("productCode eq '".concat(params.productCode, "'"));
                    }
                    if (params.locationCode) {
                        filters.push("locationCode eq '".concat(params.locationCode, "'"));
                    }
                    if (filters.length > 0) {
                        queryParams.filter = filters.join(' and ');
                    }
                    responseFields = [
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
                    queryParams.responseFields = "items(".concat(responseFields.join(','), "),totalCount,pageCount,pageSize,startIndex");
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/inventory",
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
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Inventory search failed:', error_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
                                        details: 'Failed to search inventory'
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
 * Get detailed inventory for a product
 */
function handleInventoryDetails(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, url, queryParams, responseFields, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = InventoryDetailSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = "/api/commerce/inventory/".concat(encodeURIComponent(params.productCode));
                    queryParams = {};
                    // If location is specified, get inventory for that specific location
                    if (params.locationCode) {
                        url += "/".concat(encodeURIComponent(params.locationCode));
                    }
                    responseFields = [
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
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: url,
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
                                        data: response
                                    }, null, 2)
                                }
                            ]
                        }];
                case 3:
                    error_2 = _a.sent();
                    console.error('Inventory details retrieval failed:', error_2);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_2 instanceof Error ? error_2.message : 'Unknown error occurred',
                                        details: "Failed to retrieve inventory details for product: ".concat(params.productCode)
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
 * Check stock availability for multiple products
 */
function handleStockAvailability(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, availabilityResults, _i, _a, productCode, queryParams, response, productError_1, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = StockAvailabilitySchema.parse(args);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    availabilityResults = [];
                    _i = 0, _a = params.productCodes;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    productCode = _a[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    queryParams = {
                        quantity: params.quantity,
                    };
                    if (params.locationCode) {
                        queryParams.locationCode = params.locationCode;
                    }
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/catalog/storefront/products/".concat(encodeURIComponent(productCode), "/inventoryinfo"),
                            params: queryParams,
                        })];
                case 4:
                    response = _b.sent();
                    availabilityResults.push({
                        productCode: productCode,
                        isAvailable: response.onlineStockAvailable >= params.quantity,
                        stockOnHand: response.onlineStockAvailable || 0,
                        requestedQuantity: params.quantity,
                        locationCode: params.locationCode || 'default'
                    });
                    return [3 /*break*/, 6];
                case 5:
                    productError_1 = _b.sent();
                    availabilityResults.push({
                        productCode: productCode,
                        isAvailable: false,
                        error: productError_1 instanceof Error ? productError_1.message : 'Unknown error',
                        requestedQuantity: params.quantity,
                        locationCode: params.locationCode || 'default'
                    });
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, {
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
                                                availableProducts: availabilityResults.filter(function (r) { return r.isAvailable; }).length,
                                                unavailableProducts: availabilityResults.filter(function (r) { return !r.isAvailable; }).length
                                            }
                                        }
                                    }
                                }, null, 2)
                            }
                        ]
                    }];
                case 8:
                    error_3 = _b.sent();
                    console.error('Stock availability check failed:', error_3);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred',
                                        details: 'Failed to check stock availability'
                                    }, null, 2)
                                }
                            ]
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
