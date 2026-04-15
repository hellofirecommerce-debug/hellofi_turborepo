export type InvoiceItemType = {
    id: string;
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