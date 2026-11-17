export type AddressType = "HOME" | "WORK" | "OTHER";
export type PaymentMethod = "UPI" | "BANK" | "CASH";
export type PickupMethod = "DOORSTEP" | "DROP_TO_OFFICE";

export interface Address {
  id: string;
  name: string;
  contact: string;
  alternateContactNo?: string | null;
  email: string;
  address: string;
  pinCode: string;
  landMark?: string | null;
  cityDistrict: string;
  state: string;
  gst?: string | null;
  addressType: AddressType;
  isDefault: boolean;
}

export interface OrderAnswer {
  conditionId: string;
  question: string;
  answer: string;
}

export interface CheckoutOrder {
  orderNo: string;
  orderStatus: string;
  productName: string;
  productImage?: string | null;
  brandName?: string | null;
  variantName?: string | null;
  totalAmount: number;
  answers: OrderAnswer[];
}

// ---------- checkout draft (kept in the page's useState) ----------

// result of the pincode check made when the address is confirmed
export interface AreaInfo {
  serviceable: boolean;
  isDropToOfficeAvailable: boolean;
  city?: string | null;
}

export interface ScheduleDraft {
  method: PickupMethod;
  date: string; // YYYY-MM-DD
  slot: string;
}

export type PaymentDraft =
  | { method: "UPI"; upiId: string }
  | {
      method: "BANK";
      bankName: string;
      accountHolderName: string;
      bankAccountNumber: string;
      ifscCode: string;
    }
  | { method: "CASH" };
