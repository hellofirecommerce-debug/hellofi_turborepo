export type InvoiceItemType = {
  id: string;
  inventoryProductId?: string;
  invoiceId?: string;
  product: string;
  serialNumber?: string | null;
  hsnSac?: string | null;
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
  createdAt?: string;
  updatedAt?: string;
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

export type InvoiceCompanySettingsSnapshot = {
  id: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  gstin: string;
  logoUrl?: string | null;
  stampUrl?: string | null;
  defaultInvoiceTermsBrand: string;
  defaultInvoiceTermsHellofi: string;
  defaultInvoiceTermsNone: string;
  defaultBankDetails: string;
};

export type InvoiceType = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  companySettingsId: string;
  companySettings: InvoiceCompanySettingsSnapshot;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientContact: string;
  clientGstin?: string | null;
  isInsideBangalore: boolean;
  paidBy?: string | null;
  splitPaymentDetails?: string | null;
  saleType: "DIRECT" | "EXCHANGE";
  warrantyType: "BRAND" | "HELLOFI" | "NONE";
  warrantyMonths?: number | null;
  grossValue: number;
  taxAmount: number;
  totalAmount: number;
  exchangeValue: number;
  amountPaid: number;
  cgst: number;
  sgst: number;
  igst: number;
  customInvoiceTerms?: string | null;
  customBankDetails?: string | null;
  pdfUrl?: string | null;
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
