export interface InventoryProduct {
  id: string;
  imeiOrSerial: string;
  orderId: string;
  brandId: string;
  categoryId: string;
  purchaseDate: string;
  productName: string;
  costPrice: number;
  otherCharges: number;
  sellingOtherCharges?: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  status: "NOT_LISTED" | "LISTED" | "SOLD";
  sellingDate?: string;
  sellingPrice?: number;
  invoice?: string;
  sellingCustomerName?: string;
  sellingCustomerEmail?: string;
  sellingCustomerPhone?: string;
  sellingCustomerAddress?: string;
  paymentMode?: string;
  receivedInBank?: number;
  splitPaymentDetails?: string;
  tat?: number;
  grossProfit?: number;
  isActive: boolean;
  notes?: string;

  // ── Device Condition ──
  screenCondition: "MINOR" | "MAJOR" | "NO";
  bodyCondition: "MINOR" | "MAJOR" | "NO";
  deviceIssues?: string;

  // ── Accessories ──
  hasBox: boolean;
  hasCharger: boolean;
  hasOriginalBill: boolean;

  // ── Warranty ──
  warrantyType: "ABOVE_1_YEAR" | "BELOW_1_YEAR";
  warrantyPurchaseDate?: string;

  ram: string;
  storage: string;
  createdAt: string;
  updatedAt: string;
  brand: { id: string; name: string; image: string };
  category: { id: string; name: string };
}

export interface InventoryFilter {
  search?: string;
  status?: string;
  brandId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  dateType?: "purchase" | "selling" | "all";
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface InventoryProductsResponse {
  items: InventoryProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
