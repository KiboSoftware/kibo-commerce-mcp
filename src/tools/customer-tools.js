"use strict";
/**
 * Kibo Commerce Customer Management Tools
 *
 * MCP tools for customer operations including:
 * - Customer search and retrieval
 * - Customer account management
 * - Customer order history
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
exports.registerCustomerTools = registerCustomerTools;
exports.handleCustomerTools = handleCustomerTools;
var zod_1 = require("zod");
// Validation schemas
var CustomerSearchSchema = zod_1.z.object({
    emailAddress: zod_1.z.string().optional().describe('Customer email address to search'),
    firstName: zod_1.z.string().optional().describe('Customer first name'),
    lastName: zod_1.z.string().optional().describe('Customer last name'),
    customerNumber: zod_1.z.string().optional().describe('Customer account number'),
    isActive: zod_1.z.boolean().optional().describe('Filter by active status'),
    startIndex: zod_1.z.number().min(0).default(0).describe('Starting index for pagination'),
    pageSize: zod_1.z.number().min(1).max(200).default(20).describe('Number of customers to return'),
    sortBy: zod_1.z.string().optional().describe('Sort field (e.g., "emailAddress asc", "lastName desc")'),
});
var CustomerDetailSchema = zod_1.z.object({
    customerAccountId: zod_1.z.number().describe('Customer account ID to retrieve'),
    includeAttributes: zod_1.z.boolean().default(true).describe('Include customer attributes'),
    includeContacts: zod_1.z.boolean().default(true).describe('Include customer contacts'),
    includeCards: zod_1.z.boolean().default(false).describe('Include saved payment cards (sensitive)'),
});
var CustomerOrderHistorySchema = zod_1.z.object({
    customerAccountId: zod_1.z.number().describe('Customer account ID'),
    startDate: zod_1.z.string().optional().describe('Start date for order history (ISO format)'),
    endDate: zod_1.z.string().optional().describe('End date for order history (ISO format)'),
    status: zod_1.z.string().optional().describe('Filter by order status'),
    startIndex: zod_1.z.number().min(0).default(0).describe('Starting index for pagination'),
    pageSize: zod_1.z.number().min(1).max(200).default(20).describe('Number of orders to return'),
});
/**
 * Register customer-related MCP tools
 */
function registerCustomerTools() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
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
                ]];
        });
    });
}
/**
 * Handle customer tool execution
 */
function handleCustomerTools(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (name) {
                case 'kibo_customer_search':
                    return [2 /*return*/, handleCustomerSearch(args, authService, config)];
                case 'kibo_customer_details':
                    return [2 /*return*/, handleCustomerDetails(args, authService, config)];
                case 'kibo_customer_order_history':
                    return [2 /*return*/, handleCustomerOrderHistory(args, authService, config)];
                default:
                    throw new Error("Unknown customer tool: ".concat(name));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Search for customers
 */
function handleCustomerSearch(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, filters, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = CustomerSearchSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {
                        startIndex: params.startIndex,
                        pageSize: params.pageSize,
                    };
                    filters = [];
                    if (params.emailAddress) {
                        filters.push("emailAddress eq '".concat(params.emailAddress, "'"));
                    }
                    if (params.firstName) {
                        filters.push("firstName eq '".concat(params.firstName, "'"));
                    }
                    if (params.lastName) {
                        filters.push("lastName eq '".concat(params.lastName, "'"));
                    }
                    if (params.customerNumber) {
                        filters.push("customerNumber eq '".concat(params.customerNumber, "'"));
                    }
                    if (params.isActive !== undefined) {
                        filters.push("isActive eq ".concat(params.isActive));
                    }
                    if (filters.length > 0) {
                        queryParams.filter = filters.join(' and ');
                    }
                    if (params.sortBy) {
                        queryParams.sortBy = params.sortBy;
                    }
                    // Set response fields for customer search
                    queryParams.responseFields = 'items(id,customerNumber,emailAddress,firstName,lastName,isActive,customerType,auditInfo),totalCount,pageCount,pageSize,startIndex';
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/customer/accounts",
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
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Customer search failed:', error_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
                                        details: 'Failed to search customers'
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
 * Get customer details
 */
function handleCustomerDetails(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, responseFields, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = CustomerDetailSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    responseFields = [
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
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/customer/accounts/".concat(params.customerAccountId),
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
                    console.error('Customer details retrieval failed:', error_2);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_2 instanceof Error ? error_2.message : 'Unknown error occurred',
                                        details: "Failed to retrieve customer details for ID: ".concat(params.customerAccountId)
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
 * Get customer order history
 */
function handleCustomerOrderHistory(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, filters, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = CustomerOrderHistorySchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {
                        startIndex: params.startIndex,
                        pageSize: params.pageSize,
                    };
                    filters = [
                        "customerAccountId eq ".concat(params.customerAccountId)
                    ];
                    if (params.status) {
                        filters.push("status eq '".concat(params.status, "'"));
                    }
                    if (params.startDate) {
                        filters.push("submittedDate ge datetime'".concat(params.startDate, "'"));
                    }
                    if (params.endDate) {
                        filters.push("submittedDate le datetime'".concat(params.endDate, "'"));
                    }
                    queryParams.filter = filters.join(' and ');
                    // Set response fields for order history
                    queryParams.responseFields = 'items(orderNumber,status,submittedDate,total,subtotal,taxTotal,shippingTotal,items),totalCount,pageCount,pageSize,startIndex';
                    queryParams.sortBy = 'submittedDate desc';
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/orders",
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
                        }];
                case 3:
                    error_3 = _a.sent();
                    console.error('Customer order history retrieval failed:', error_3);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred',
                                        details: "Failed to retrieve order history for customer ID: ".concat(params.customerAccountId)
                                    }, null, 2)
                                }
                            ]
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
