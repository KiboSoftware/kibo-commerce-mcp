"use strict";
/**
 * Kibo Commerce Authentication Service
 *
 * Handles OAuth2 authentication with Kibo Commerce API,
 * including token management, refresh, and caching.
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
exports.KiboAuthService = void 0;
var axios_1 = require("axios");
var KiboAuthService = /** @class */ (function () {
    function KiboAuthService(config) {
        var _this = this;
        this.tokens = null;
        this.refreshPromise = null;
        this.config = config;
        this.httpClient = axios_1.default.create({
            baseURL: config.apiHost,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor for authentication
        this.httpClient.interceptors.request.use(function (config) { return _this.addAuthHeaders(config); }, function (error) { return Promise.reject(error); });
        // Add response interceptor for token refresh
        this.httpClient.interceptors.response.use(function (response) { return response; }, function (error) { return __awaiter(_this, void 0, void 0, function () {
            var refreshError_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && !error.config._retry)) return [3 /*break*/, 4];
                        error.config._retry = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.httpClient.request(error.config)];
                    case 3:
                        refreshError_1 = _b.sent();
                        console.error('Token refresh failed:', refreshError_1);
                        throw refreshError_1;
                    case 4: return [2 /*return*/, Promise.reject(error)];
                }
            });
        }); });
    }
    /**
     * Initialize the authentication service by obtaining initial tokens
     */
    KiboAuthService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.authenticate()];
                    case 1:
                        _a.sent();
                        console.log('Kibo authentication initialized successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to initialize Kibo authentication:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Authenticate with Kibo Commerce using client credentials
     */
    KiboAuthService.prototype.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authUrl, authData, response, tokenData, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        authUrl = "".concat(this.config.apiHost, "/api/platform/applications/authtickets/oauth");
                        authData = {
                            client_id: this.config.clientId,
                            client_secret: this.config.clientSecret,
                            grant_type: 'client_credentials'
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post(authUrl, authData, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                timeout: 30000,
                            })];
                    case 2:
                        response = _c.sent();
                        tokenData = response.data;
                        this.tokens = {
                            accessToken: tokenData.access_token,
                            tokenType: tokenData.token_type || 'Bearer',
                            expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                            refreshToken: tokenData.refresh_token,
                        };
                        return [2 /*return*/, this.tokens];
                    case 3:
                        error_2 = _c.sent();
                        console.error('Authentication failed:', error_2);
                        if (axios_1.default.isAxiosError(error_2)) {
                            console.error('Response data:', (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                            console.error('Response status:', (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.status);
                        }
                        throw new Error("Kibo authentication failed: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Refresh the access token if needed
     */
    KiboAuthService.prototype.refreshAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Prevent concurrent refresh requests
                        if (this.refreshPromise) {
                            return [2 /*return*/, this.refreshPromise];
                        }
                        this.refreshPromise = this.authenticate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.refreshPromise];
                    case 2:
                        tokens = _a.sent();
                        this.refreshPromise = null;
                        return [2 /*return*/, tokens];
                    case 3:
                        error_3 = _a.sent();
                        this.refreshPromise = null;
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current valid access token, refreshing if necessary
     */
    KiboAuthService.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Check if we have tokens and they're not expired
                        if (this.tokens && this.isTokenValid()) {
                            return [2 /*return*/, this.tokens.accessToken];
                        }
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        tokens = _a.sent();
                        return [2 /*return*/, tokens.accessToken];
                }
            });
        });
    };
    /**
     * Check if current token is valid (not expired with buffer)
     */
    KiboAuthService.prototype.isTokenValid = function () {
        if (!this.tokens) {
            return false;
        }
        // Add 5 minute buffer before expiration
        var bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        var now = new Date();
        return this.tokens.expiresAt.getTime() > (now.getTime() + bufferTime);
    };
    /**
     * Add authentication headers to request config
     */
    KiboAuthService.prototype.addAuthHeaders = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var token, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Skip auth for authentication requests
                        if ((_a = config.url) === null || _a === void 0 ? void 0 : _a.includes('/authtickets/oauth')) {
                            return [2 /*return*/, config];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getAccessToken()];
                    case 2:
                        token = _b.sent();
                        config.headers = config.headers || {};
                        config.headers.Authorization = "Bearer ".concat(token);
                        // Add tenant context headers
                        config.headers['x-vol-tenant'] = this.config.tenantId.toString();
                        if (this.config.siteId) {
                            config.headers['x-vol-site'] = this.config.siteId.toString();
                        }
                        if (this.config.masterCatalogId) {
                            config.headers['x-vol-master-catalog'] = this.config.masterCatalogId.toString();
                        }
                        return [2 /*return*/, config];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Failed to add auth headers:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get authenticated HTTP client
     */
    KiboAuthService.prototype.getHttpClient = function () {
        return this.httpClient;
    };
    /**
     * Make authenticated API request
     */
    KiboAuthService.prototype.request = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClient.request(config)];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_5 = _c.sent();
                        console.error('API request failed:', error_5);
                        if (axios_1.default.isAxiosError(error_5)) {
                            console.error('Response data:', (_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data);
                            console.error('Response status:', (_b = error_5.response) === null || _b === void 0 ? void 0 : _b.status);
                        }
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current token information (for debugging)
     */
    KiboAuthService.prototype.getTokenInfo = function () {
        if (!this.tokens) {
            return { hasToken: false };
        }
        return {
            hasToken: true,
            expiresAt: this.tokens.expiresAt,
            isValid: this.isTokenValid(),
        };
    };
    return KiboAuthService;
}());
exports.KiboAuthService = KiboAuthService;
