export type InvoiceItemType = {
  id: string;
  inventoryProductId?: string;
  product: string;
  serialNumber?: string;
  hsnSac?: string;
  qty: number;
  uom: string;
  rate: number;
  total: number;
  discount: number;
  gross: number;
  gstAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  sortOrder: number;
};

export type InvoiceExchangeItemType = {
  id: string;
  productName: string;
  serialNumber?: string;
  brandId?: string;
  categoryId?: string;
  ram?: string;
  storage?: string;
  exchangeValue?: number;
};

export type InvoiceType = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  companySettingsId: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  companyGstin: string;
  logoUrl?: string;
  stampUrl?: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientContact: string;
  clientGstin?: string;
  isInsideBangalore: boolean;
  paidBy?: string;
  splitPaymentDetails?: string; // ← add this
  saleType: "DIRECT" | "EXCHANGE";
  warrantyType: "BRAND" | "HELLOFI" | "NONE";
  warrantyMonths?: number;
  grossValue: number;
  taxAmount: number;
  totalAmount: number;
  exchangeValue: number;
  amountPaid: number;
  cgst: number;
  sgst: number;
  igst: number;
  invoiceTerms: string;
  bankDetails: string;
  customInvoiceTerms?: string;
  customBankDetails?: string;
  pdfUrl?: string;
  status: "DRAFT" | "FINALIZED" | "CANCELLED";
  items: InvoiceItemType[];
  exchangeItems: InvoiceExchangeItemType[];
  createdAt: string;
  updatedAt: string;
};

export type GetInvoicesResponse = {
  getInvoices: {
    items: InvoiceType[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type GetInvoiceByIdResponse = {
  getInvoiceById: InvoiceType;
};

// ── Add these at the bottom of your types file ──

export type InventoryProductForInvoice = {
  id: string;
  productName: string;
  imeiOrSerial: string;
  orderId: string;
  ram?: string;
  storage?: string;
  costPrice: number;
  otherCharges: number;
  brandId: string;
  categoryId: string;
  status: string;
  isEligible: boolean;
  ineligibleReason?: string;
};

export type GetInventoryProductForInvoiceResponse = {
  getInventoryProductForInvoice: InventoryProductForInvoice;
};
