#!/usr/bin/env node
"use strict";
/**
 * Kibo Commerce MCP Server
 *
 * A Model Context Protocol server providing integration with Kibo Commerce platform.
 * Supports product management, order operations, customer management, and more.
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
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var dotenv_1 = require("dotenv");
var auth_service_js_1 = require("./auth/auth-service.js");
var product_tools_js_1 = require("./tools/product-tools.js");
var order_tools_js_1 = require("./tools/order-tools.js");
var customer_tools_js_1 = require("./tools/customer-tools.js");
var inventory_tools_js_1 = require("./tools/inventory-tools.js");
// Load environment variables
dotenv_1.default.config();
/**
 * Validate required environment variables
 */
function validateConfig() {
    var requiredVars = [
        'KIBO_API_HOST',
        'KIBO_CLIENT_ID',
        'KIBO_CLIENT_SECRET',
        'KIBO_TENANT_ID',
        'KIBO_SITE_ID'
    ];
    var missing = requiredVars.filter(function (varName) { return !process.env[varName]; });
    if (missing.length > 0) {
        throw new Error("Missing required environment variables: ".concat(missing.join(', ')));
    }
    return {
        apiHost: process.env.KIBO_API_HOST,
        clientId: process.env.KIBO_CLIENT_ID,
        clientSecret: process.env.KIBO_CLIENT_SECRET,
        tenantId: parseInt(process.env.KIBO_TENANT_ID),
        siteId: parseInt(process.env.KIBO_SITE_ID),
        masterCatalogId: process.env.KIBO_MASTER_CATALOG_ID ? parseInt(process.env.KIBO_MASTER_CATALOG_ID) : undefined,
        locale: process.env.KIBO_LOCALE || 'en-US',
        currency: process.env.KIBO_CURRENCY || 'USD',
        logLevel: process.env.MCP_LOG_LEVEL || 'info'
    };
}
/**
 * Create and configure the MCP server
 */
function createServer() {
    return __awaiter(this, void 0, void 0, function () {
        var config, authService, server, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = validateConfig();
                    authService = new auth_service_js_1.KiboAuthService(config);
                    server = new index_js_1.Server({
                        name: 'kibo-commerce-mcp',
                        version: '0.1.0',
                    }, {
                        capabilities: {
                            tools: {},
                        },
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, authService.initialize()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to initialize Kibo authentication:', error_1);
                    throw error_1;
                case 4:
                    // Register tool handlers
                    server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, _d;
                        var _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _e = {};
                                    _a = [[]];
                                    return [4 /*yield*/, (0, product_tools_js_1.registerProductTools)()];
                                case 1:
                                    _b = [__spreadArray.apply(void 0, _a.concat([_f.sent(), true]))];
                                    return [4 /*yield*/, (0, order_tools_js_1.registerOrderTools)()];
                                case 2:
                                    _c = [__spreadArray.apply(void 0, _b.concat([_f.sent(), true]))];
                                    return [4 /*yield*/, (0, customer_tools_js_1.registerCustomerTools)()];
                                case 3:
                                    _d = [__spreadArray.apply(void 0, _c.concat([_f.sent(), true]))];
                                    return [4 /*yield*/, (0, inventory_tools_js_1.registerInventoryTools)()];
                                case 4: return [2 /*return*/, (_e.tools = __spreadArray.apply(void 0, _d.concat([_f.sent(), true])),
                                        _e)];
                            }
                        });
                    }); });
                    server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, name, args, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = request.params, name = _a.name, args = _a.arguments;
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 11, , 12]);
                                    if (!name.startsWith('kibo_product_')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, handleProductTool(name, args, authService, config)];
                                case 2: return [2 /*return*/, _b.sent()];
                                case 3:
                                    if (!name.startsWith('kibo_order_')) return [3 /*break*/, 5];
                                    return [4 /*yield*/, handleOrderTool(name, args, authService, config)];
                                case 4: return [2 /*return*/, _b.sent()];
                                case 5:
                                    if (!name.startsWith('kibo_customer_')) return [3 /*break*/, 7];
                                    return [4 /*yield*/, handleCustomerTool(name, args, authService, config)];
                                case 6: return [2 /*return*/, _b.sent()];
                                case 7:
                                    if (!name.startsWith('kibo_inventory_')) return [3 /*break*/, 9];
                                    return [4 /*yield*/, handleInventoryTool(name, args, authService, config)];
                                case 8: return [2 /*return*/, _b.sent()];
                                case 9: throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, "Unknown tool: ".concat(name));
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    error_2 = _b.sent();
                                    console.error("Error executing tool ".concat(name, ":"), error_2);
                                    throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, "Tool execution failed: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, server];
            }
        });
    });
}
/**
 * Tool handler functions (to be imported from tool modules)
 */
function handleProductTool(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var handleProductTools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('./tools/product-tools.js'); })];
                case 1:
                    handleProductTools = (_a.sent()).handleProductTools;
                    return [2 /*return*/, handleProductTools(name, args, authService, config)];
            }
        });
    });
}
function handleOrderTool(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var handleOrderTools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('./tools/order-tools.js'); })];
                case 1:
                    handleOrderTools = (_a.sent()).handleOrderTools;
                    return [2 /*return*/, handleOrderTools(name, args, authService, config)];
            }
        });
    });
}
function handleCustomerTool(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var handleCustomerTools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('./tools/customer-tools.js'); })];
                case 1:
                    handleCustomerTools = (_a.sent()).handleCustomerTools;
                    return [2 /*return*/, handleCustomerTools(name, args, authService, config)];
            }
        });
    });
}
function handleInventoryTool(name, args, authService, config) {
    return __awaiter(this, void 0, void 0, function () {
        var handleInventoryTools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('./tools/inventory-tools.js'); })];
                case 1:
                    handleInventoryTools = (_a.sent()).handleInventoryTools;
                    return [2 /*return*/, handleInventoryTools(name, args, authService, config)];
            }
        });
    });
}
/**
 * Main function to start the server
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var server, transport, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, createServer()];
                case 1:
                    server = _a.sent();
                    transport = new stdio_js_1.StdioServerTransport();
                    console.error('Kibo Commerce MCP Server starting...');
                    return [4 /*yield*/, server.connect(transport)];
                case 2:
                    _a.sent();
                    console.error('Kibo Commerce MCP Server connected and ready!');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Failed to start Kibo Commerce MCP Server:', error_3);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Handle graceful shutdown
process.on('SIGINT', function () {
    console.error('Shutting down Kibo Commerce MCP Server...');
    process.exit(0);
});
process.on('SIGTERM', function () {
    console.error('Shutting down Kibo Commerce MCP Server...');
    process.exit(0);
});
// Start the server
if (import.meta.url === "file://".concat(process.argv[1])) {
    main().catch(function (error) {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
