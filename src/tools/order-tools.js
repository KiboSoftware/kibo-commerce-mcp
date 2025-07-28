"use strict";
/**
 * Kibo Commerce Order Management Tools
 *
 * MCP tools for order operations including:
 * - Order search and retrieval
 * - Order status updates
 * - Fulfillment management
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrderTools = registerOrderTools;
exports.handleOrderTools = handleOrderTools;
var zod_1 = require("zod");
// Validation schemas
var OrderSearchSchema = zod_1.z.object({
    customerEmailAddress: zod_1.z.string().optional().describe('Customer email address to filter orders'),
    status: zod_1.z.string().optional().describe('Order status (e.g., "Pending", "Processing", "Completed", "Cancelled")'),
    startDate: zod_1.z.string().optional().describe('Start date for order search (ISO format)'),
    endDate: zod_1.z.string().optional().describe('End date for order search (ISO format)'),
    orderNumber: zod_1.z.string().optional().describe('Specific order number to search'),
    startIndex: zod_1.z.number().min(0).default(0).describe('Starting index for pagination'),
    pageSize: zod_1.z.number().min(1).max(200).default(20).describe('Number of orders to return'),
    sortBy: zod_1.z.string().optional().describe('Sort field (e.g., "orderDate desc", "orderNumber asc")'),
});
var OrderDetailSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().describe('Order number to retrieve'),
    includeItems: zod_1.z.boolean().default(true).describe('Include order line items'),
    includePayments: zod_1.z.boolean().default(true).describe('Include payment information'),
    includeFulfillment: zod_1.z.boolean().default(true).describe('Include fulfillment information'),
});
var OrderStatusUpdateSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().describe('Order number to update'),
    status: zod_1.z.string().describe('New order status'),
    note: zod_1.z.string().optional().describe('Optional note for status change'),
});
/**
 * Register order-related MCP tools
 */
function registerOrderTools() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
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
                ]];
        });
    });
}
/**
 * Handle order tool execution
 */
function handleOrderTools(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (name) {
                case 'kibo_order_search':
                    return [2 /*return*/, handleOrderSearch(args, authService, config)];
                case 'kibo_order_details':
                    return [2 /*return*/, handleOrderDetails(args, authService, config)];
                case 'kibo_order_status_update':
                    return [2 /*return*/, handleOrderStatusUpdate(args, authService, config)];
                default:
                    throw new Error("Unknown order tool: ".concat(name));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Search for orders
 */
function handleOrderSearch(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, queryParams, filters, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = OrderSearchSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    queryParams = {
                        startIndex: params.startIndex,
                        pageSize: params.pageSize,
                    };
                    filters = [];
                    if (params.customerEmailAddress) {
                        filters.push("customerAccount.emailAddress eq '".concat(params.customerEmailAddress, "'"));
                    }
                    if (params.status) {
                        filters.push("status eq '".concat(params.status, "'"));
                    }
                    if (params.orderNumber) {
                        filters.push("orderNumber eq '".concat(params.orderNumber, "'"));
                    }
                    if (params.startDate) {
                        filters.push("submittedDate ge datetime'".concat(params.startDate, "'"));
                    }
                    if (params.endDate) {
                        filters.push("submittedDate le datetime'".concat(params.endDate, "'"));
                    }
                    if (filters.length > 0) {
                        queryParams.filter = filters.join(' and ');
                    }
                    if (params.sortBy) {
                        queryParams.sortBy = params.sortBy;
                    }
                    // Set response fields
                    queryParams.responseFields = 'items(orderNumber,status,submittedDate,total,customerAccount,billingInfo,fulfillmentInfo),totalCount,pageCount,pageSize,startIndex';
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
                    error_1 = _a.sent();
                    console.error('Order search failed:', error_1);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
                                        details: 'Failed to search orders'
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
 * Get order details
 */
function handleOrderDetails(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, responseFields, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = OrderDetailSchema.parse(args);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    responseFields = [
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
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/orders/".concat(encodeURIComponent(params.orderNumber)),
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
                    console.error('Order details retrieval failed:', error_2);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_2 instanceof Error ? error_2.message : 'Unknown error occurred',
                                        details: "Failed to retrieve order details for: ".concat(params.orderNumber)
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
 * Update order status
 */
function handleOrderStatusUpdate(args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var params, currentOrder, updateData, newNote, response, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    params = OrderStatusUpdateSchema.parse(args);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, authService.request({
                            method: 'GET',
                            url: "/api/commerce/orders/".concat(encodeURIComponent(params.orderNumber)),
                        })];
                case 2:
                    currentOrder = _b.sent();
                    updateData = __assign(__assign({}, currentOrder), { status: params.status, auditInfo: __assign(__assign({}, currentOrder.auditInfo), { updateDate: new Date().toISOString(), updateBy: 'mcp-server' }) });
                    // Add note if provided
                    if (params.note) {
                        newNote = {
                            text: params.note,
                            noteDate: new Date().toISOString(),
                            noteBy: 'mcp-server'
                        };
                        updateData.notes = currentOrder.notes ? __spreadArray(__spreadArray([], currentOrder.notes, true), [newNote], false) : [newNote];
                    }
                    return [4 /*yield*/, authService.request({
                            method: 'PUT',
                            url: "/api/commerce/orders/".concat(encodeURIComponent(params.orderNumber)),
                            data: updateData
                        })];
                case 3:
                    response = _b.sent();
                    return [2 /*return*/, {
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
                                            updatedDate: (_a = response.auditInfo) === null || _a === void 0 ? void 0 : _a.updateDate
                                        },
                                        message: "Order ".concat(params.orderNumber, " status updated from ").concat(currentOrder.status, " to ").concat(params.status)
                                    }, null, 2)
                                }
                            ]
                        }];
                case 4:
                    error_3 = _b.sent();
                    console.error('Order status update failed:', error_3);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify({
                                        success: false,
                                        error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred',
                                        details: "Failed to update status for order: ".concat(params.orderNumber)
                                    }, null, 2)
                                }
                            ]
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
