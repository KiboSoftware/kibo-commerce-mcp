/**
 * Kibo Commerce API Type Definitions
 * 
 * Type definitions for common Kibo Commerce API entities
 */

// Common audit information
export interface AuditInfo {
  updateDate?: string;
  createDate?: string;
  updateBy?: string;
  createBy?: string;
}

// Product-related types
export interface Product {
  productCode: string;
  productName: string;
  description?: string;
  content?: ProductContent;
  price?: number;
  salePrice?: number;
  imageUrl?: string;
  images?: ProductImage[];
  categoryId?: number;
  productUsage?: string;
  fulfillmentTypesSupported?: string[];
  isPackagedStandAlone?: boolean;
  variations?: ProductVariation[];
  options?: ProductOption[];
  properties?: ProductProperty[];
  inventoryInfo?: InventoryInfo;
  priceRange?: PriceRange;
  auditInfo?: AuditInfo;
}

export interface ProductContent {
  productName?: string;
  productFullDescription?: string;
  productShortDescription?: string;
  seoFriendlyUrl?: string;
  metaTagTitle?: string;
  metaTagDescription?: string;
  metaTagKeywords?: string;
}

export interface ProductImage {
  id?: string;
  altText?: string;
  imageUrl?: string;
  cmsId?: string;
  videoUrl?: string;
  mediaType?: string;
  sequence?: number;
}

export interface ProductVariation {
  productCode?: string;
  price?: number;
  salePrice?: number;
  options?: VariationOption[];
  deltaPrice?: number;
  deltaWeight?: number;
}

export interface VariationOption {
  attributeFQN?: string;
  value?: any;
  deltaPrice?: number;
  deltaWeight?: number;
}

export interface ProductOption {
  attributeFQN?: string;
  isRequired?: boolean;
  isMultiValue?: boolean;
  values?: ProductOptionValue[];
}

export interface ProductOptionValue {
  value?: any;
  deltaPrice?: number;
  deltaWeight?: number;
  isDefault?: boolean;
}

export interface ProductProperty {
  attributeFQN?: string;
  values?: ProductPropertyValue[];
}

export interface ProductPropertyValue {
  value?: any;
  stringValue?: string;
}

export interface PriceRange {
  lower?: number;
  upper?: number;
}

// Category-related types
export interface Category {
  categoryId?: number;
  categoryCode?: string;
  content?: CategoryContent;
  parentCategoryCode?: string;
  isDisplayed?: boolean;
  count?: number;
  childrenCategories?: Category[];
  products?: Product[];
  auditInfo?: AuditInfo;
}

export interface CategoryContent {
  name?: string;
  description?: string;
  slug?: string;
  metaTagTitle?: string;
  metaTagDescription?: string;
  metaTagKeywords?: string;
}

// Inventory-related types
export interface InventoryInfo {
  manageStock?: boolean;
  outOfStockBehavior?: string;
  onlineStockAvailable?: number;
  onlineLocationCode?: string;
}

export interface InventoryItem {
  productCode: string;
  locationCode: string;
  stockOnHand: number;
  available: number;
  allocated: number;
  pending: number;
  reserved: number;
  lastUpdated?: string;
  transactions?: InventoryTransaction[];
}

export interface InventoryTransaction {
  transactionId?: string;
  transactionType?: string;
  quantity?: number;
  notes?: string;
  transactionDate?: string;
  userId?: string;
}

// Order-related types
export interface Order {
  orderNumber?: string;
  status?: string;
  submittedDate?: string;
  total?: number;
  subtotal?: number;
  taxTotal?: number;
  shippingTotal?: number;
  discountTotal?: number;
  customerAccount?: CustomerAccount;
  billingInfo?: BillingInfo;
  fulfillmentInfo?: FulfillmentInfo;
  items?: OrderItem[];
  payments?: Payment[];
  packages?: Package[];
  shipments?: Shipment[];
  notes?: OrderNote[];
  auditInfo?: AuditInfo;
}

export interface OrderItem {
  id?: string;
  lineId?: number;
  product?: Product;
  quantity?: number;
  unitPrice?: number;
  extendedTotal?: number;
  discountTotal?: number;
  taxTotal?: number;
  fulfillmentMethod?: string;
  fulfillmentLocationCode?: string;
}

export interface OrderNote {
  text?: string;
  noteDate?: string;
  noteBy?: string;
}

// Customer-related types
export interface CustomerAccount {
  id?: number;
  customerNumber?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  middleNameOrInitial?: string;
  companyOrOrganization?: string;
  customerType?: string;
  isActive?: boolean;
  acceptsMarketing?: boolean;
  hasExternalPassword?: boolean;
  isAnonymous?: boolean;
  attributes?: CustomerAttribute[];
  contacts?: CustomerContact[];
  cards?: CustomerCard[];
  auditInfo?: AuditInfo;
}

export interface CustomerAttribute {
  fullyQualifiedName?: string;
  attributeDefinitionId?: number;
  values?: any[];
}

export interface CustomerContact {
  id?: number;
  email?: string;
  firstName?: string;
  middleNameOrInitial?: string;
  lastNameOrSurname?: string;
  companyOrOrganization?: string;
  phoneNumbers?: Phone;
  address?: Address;
  types?: ContactType[];
}

export interface CustomerCard {
  id?: string;
  cardType?: string;
  cardNumber?: string;
  expireMonth?: number;
  expireYear?: number;
  contactId?: number;
  isDefaultPayMethod?: boolean;
}

// Contact and address types
export interface Phone {
  home?: string;
  mobile?: string;
  work?: string;
}

export interface Address {
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  cityOrTown?: string;
  stateOrProvince?: string;
  postalOrZipCode?: string;
  countryCode?: string;
  addressType?: string;
  isValidated?: boolean;
}

export interface ContactType {
  name?: string;
  isPrimary?: boolean;
}

// Billing and fulfillment types
export interface BillingInfo {
  billingContact?: CustomerContact;
  isSameBillingShippingAddress?: boolean;
  card?: CustomerCard;
  storeCreditCode?: string;
  purchaseOrder?: PurchaseOrder;
  check?: Check;
}

export interface FulfillmentInfo {
  fulfillmentContact?: CustomerContact;
  shippingMethodCode?: string;
  shippingMethodName?: string;
  data?: any;
}

export interface PurchaseOrder {
  purchaseOrderNumber?: string;
  amount?: number;
}

export interface Check {
  checkNumber?: string;
  amount?: number;
}

// Payment types
export interface Payment {
  id?: string;
  paymentType?: string;
  billingInfo?: BillingInfo;
  amount?: number;
  amountCollected?: number;
  amountCredited?: number;
  amountRequested?: number;
  status?: string;
  interactions?: PaymentInteraction[];
  auditInfo?: AuditInfo;
}

export interface PaymentInteraction {
  id?: string;
  gatewayTransactionId?: string;
  transactionType?: string;
  amount?: number;
  status?: string;
  responseCode?: string;
  responseText?: string;
  checkNumber?: string;
  returnedCheck?: boolean;
  auditInfo?: AuditInfo;
}

// Fulfillment types
export interface Package {
  id?: string;
  code?: string;
  fulfillmentLocationCode?: string;
  items?: PackageItem[];
  measurements?: PackageMeasurements;
  trackingNumbers?: TrackingNumber[];
  status?: string;
  auditInfo?: AuditInfo;
}

export interface PackageItem {
  lineId?: number;
  productCode?: string;
  quantity?: number;
}

export interface PackageMeasurements {
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
}

export interface TrackingNumber {
  number?: string;
  url?: string;
}

export interface Shipment {
  id?: string;
  shipmentNumber?: string;
  fulfillmentLocationCode?: string;
  items?: ShipmentItem[];
  packageIds?: string[];
  cost?: number;
  currencyCode?: string;
  status?: string;
  auditInfo?: AuditInfo;
}

export interface ShipmentItem {
  lineId?: number;
  productCode?: string;
  quantity?: number;
}

// Common response types
export interface ApiCollectionResponse<T> {
  items?: T[];
  totalCount?: number;
  pageCount?: number;
  pageSize?: number;
  startIndex?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}