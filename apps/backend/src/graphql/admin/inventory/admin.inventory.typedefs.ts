export const typeDefs = `#graphql
  enum InventoryStatus {
    NOT_LISTED
    LISTED
    SOLD
  }

  enum PaymentMode {
    CASH
    UPI
    CREDIT_CARD
    DEBIT_CARD
    SPLIT_PAYMENT
    RAZORPAY
  }

  type InventoryProduct {
    id: ID!
    imeiOrSerial: String!
    orderId: String!
    brandId: String!
    categoryId: String!
    purchaseDate: DateTime!
    productName: String!
    ram: String
    storage: String
    costPrice: Float!
    otherCharges: Float!
    sellingOtherCharges: Float
    customerName: String!
    customerEmail: String
    customerPhone: String!
    customerAddress: String!
    status: InventoryStatus!
    sellingDate: DateTime
    sellingPrice: Float
    invoice: String
    sellingCustomerName: String
    sellingCustomerEmail: String
    sellingCustomerPhone: String
    sellingCustomerAddress: String
    paymentMode: PaymentMode
    receivedInBank: Float
    splitPaymentDetails: String
    tat: Int
    grossProfit: Float
    isActive: Boolean!
    notes: String
    screenCondition: String!
    bodyCondition: String!
    deviceIssues: String
    hasBox: Boolean!
    hasCharger: Boolean!
    hasOriginalBill: Boolean!
    warrantyType: String!
    warrantyPurchaseDate: DateTime
    createdAt: String!
    updatedAt: String!
    brand: Brand
    category: Category
  }

  input InventoryFilterInput {
    search: String
    status: InventoryStatus
    brandId: ID
    categoryId: ID
    dateFrom: DateTime      # ← single date range covers both purchase and selling
    dateTo: DateTime
    dateType: String        # ← "purchase" or "selling" or "all"
    page: Int
    pageSize: Int
    sortBy: String
    sortOrder: String
  }

  type InventoryProductsResponse {
    items: [InventoryProduct!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input CreateInventoryProductInput {
    imeiOrSerial: String!
    brandId: String!
    categoryId: String!
    purchaseDate: DateTime!
    productName: String!
    ram: String
    storage: String
    costPrice: Float!
    otherCharges: Float
    customerName: String!
    customerEmail: String
    customerPhone: String!
    customerAddress: String!
    status: InventoryStatus
    notes: String
    screenCondition: String
    bodyCondition: String
    deviceIssues: String
    hasBox: Boolean
    hasCharger: Boolean
    hasOriginalBill: Boolean
    warrantyType: String
    warrantyPurchaseDate: DateTime
  }

  input UpdateInventoryProductInput {
  id: ID!
  imeiOrSerial: String!
  brandId: String!
  categoryId: String!
  purchaseDate: DateTime!
  productName: String!
  ram: String
  storage:String
  costPrice: Float!
  otherCharges: Float
  customerName: String!
  customerEmail: String
  customerPhone: String!
  customerAddress: String!
  status: InventoryStatus!
  notes: String
  # ← add all new fields
  screenCondition: String
  bodyCondition: String
  deviceIssues: String
  hasBox: Boolean
  hasCharger: Boolean
  hasOriginalBill: Boolean
  warrantyType: String
  warrantyPurchaseDate: DateTime
}

input MarkAsSoldInput {
  id: ID!
  sellingDate: DateTime!
  sellingPrice: Float!
  sellingCustomerName: String!
  sellingCustomerEmail: String
  sellingCustomerPhone: String!
  sellingCustomerAddress: String!
  paymentMode: PaymentMode!
  receivedInBank: Float!        # ← required now
  sellingOtherCharges: Float    # ← new
  splitPaymentDetails: String
}

type ProductNameSearchResult {
  names: [String!]!
  hasMore: Boolean!
}
`;
