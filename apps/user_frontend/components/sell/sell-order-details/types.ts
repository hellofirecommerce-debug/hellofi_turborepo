export interface OrderAddress {
  name?: string | null;
  contact?: string | null;
  address?: string | null;
  landMark?: string | null;
  cityDistrict?: string | null;
  state?: string | null;
  pinCode?: string | null;
}

export interface OrderAnswer {
  conditionId: string;
  question: string;
  answer: string;
}

export interface ConfirmedOrder {
  orderNo: string;
  orderStatus: string;
  createdAt: string; // ISO date-time
  productName: string;
  productImage?: string | null;
  brandName?: string | null;
  variantName?: string | null;
  totalAmount: number;
  isDropToOffice: boolean;
  pickupISODate?: string | null;
  pickupSlot?: string | null;
  dropToOfficeISODate?: string | null;
  dropToOfficeSlotTimings?: string | null;
  paymentMethod?: "UPI" | "BANK" | "CASH" | null;
  address?: OrderAddress | null;
  answers: OrderAnswer[];
}
