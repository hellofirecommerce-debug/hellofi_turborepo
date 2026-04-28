export const typeDefs = `#graphql

  enum SaleType {
    DIRECT
    EXCHANGE
  }

  enum InvoiceWarrantyType {
    BRAND
    HELLOFI
    NONE
  }

  enum InvoiceStatus {
    DRAFT
    FINALIZED
    CANCELLED
  }

  type InvoiceItem {
    id: ID!
    invoiceId: String!
    inventoryProductId: String  
    product: String!
    serialNumber: String
    hsnSac: String
    qty: Int!
    uom: String!
    rate: Float!
    total: Float!
    discount: Float!
    gross: Float!
    gstAmount: Float!
    cgstPercent: Float!
    cgstAmount: Float!
    sgstPercent: Float!
    sgstAmount: Float!
    igstPercent: Float!
    igstAmount: Float!
    sortOrder: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type InvoiceExchangeItem {
  id: ID!
  invoiceId: String!
  productName: String!
  serialNumber: String
  brandId: String
  categoryId: String
  ram: String
  storage: String
  exchangeValue: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}

  type Invoice {
  id: ID!
  invoiceNumber: String!
  invoiceDate: DateTime!

  # ── Settings — all company details from here ──
  companySettingsId: String!
  companySettings: InvoiceCompanySettings!  # ← include relation

  clientName: String!
  clientAddress: String!
  clientEmail: String!
  clientContact: String!
  clientGstin: String
  isInsideBangalore: Boolean!
  paidBy: PaymentMode
  splitPaymentDetails: String 

  saleType: SaleType!
  warrantyType: InvoiceWarrantyType!
  warrantyMonths: Int

  grossValue: Float!
  taxAmount: Float!
  totalAmount: Float!
  exchangeValue: Float!
  amountPaid: Float!

  cgst: Float!
  sgst: Float!
  igst: Float!

  # ── null means use settings default ──
  customInvoiceTerms: String
  customBankDetails: String

  pdfUrl: String
  status: InvoiceStatus!

  items: [InvoiceItem!]!
  exchangeItems: [InvoiceExchangeItem!]!

  createdAt: DateTime!
  updatedAt: DateTime!
}

  type InvoicesResponse {
    items: [Invoice!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input InvoiceFilterInput {
    search: String
    status: InvoiceStatus
    dateFrom: String
    dateTo: String
    page: Int
    pageSize: Int
    sortBy: String
    sortOrder: String
  }

  input CreateInvoiceItemInput {
    inventoryProductId: ID     
    product: String!
    serialNumber: String
    hsnSac: String
    qty: Int!
    uom: String!
    rate: Float!
    total: Float!
    discount: Float
    gross: Float!
    gstAmount: Float
    cgstPercent: Float
    cgstAmount: Float
    sgstPercent: Float
    sgstAmount: Float
    igstPercent: Float
    igstAmount: Float
    sortOrder: Int
  }

  input CreateExchangeItemInput {
  productName: String!
  serialNumber: String!
  brandId: String!
  categoryId: String!
  ram: String
  storage: String
  exchangeValue: Float!
}

  input CreateInvoiceInput {
  invoiceNumber: String!
  invoiceDate: String!
  companySettingsId: String!

  # ── No company snapshot fields ──

  clientName: String!
  clientAddress: String!
  clientEmail: String
  clientContact: String!
  clientGstin: String
  isInsideBangalore: Boolean!
  paidBy: PaymentMode
  splitPaymentDetails: String    

  saleType: SaleType
  warrantyType: InvoiceWarrantyType
  warrantyMonths: Int

  grossValue: Float!
  taxAmount: Float!
  totalAmount: Float!
  exchangeValue: Float
  amountPaid: Float!

  cgst: Float
  sgst: Float
  igst: Float

  # ── Send full terms from frontend — backend compares with settings ──
  invoiceTerms: String!
  bankDetails: String!

  items: [CreateInvoiceItemInput!]!
  exchangeItems: [CreateExchangeItemInput!]
}


input UpdateExchangeItemInput {
  productName: String!
  serialNumber: String!
  brandId: String!
  categoryId: String!
  ram: String
  storage: String
  exchangeValue: Float!
}
input UpdateInvoiceInput {
  id: ID!
  invoiceNumber: String
  invoiceDate: String
  companySettingsId: String
  clientName: String
  clientAddress: String
  clientEmail: String
  clientContact: String
  clientGstin: String
  isInsideBangalore: Boolean
  paidBy: PaymentMode
  splitPaymentDetails: String
  saleType: SaleType
  warrantyType: InvoiceWarrantyType
  warrantyMonths: Int
  grossValue: Float
  taxAmount: Float
  totalAmount: Float
  exchangeValue: Float
  amountPaid: Float
  cgst: Float
  sgst: Float
  igst: Float
  invoiceTerms: String
  bankDetails: String
  items: [CreateInvoiceItemInput!]
  exchangeItems: [UpdateExchangeItemInput!]
}
`;
