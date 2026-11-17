export type DateFilterOption =
  | "ALL_TIME"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "YEAR"
  | "MONTH_YEAR"
  | "DAY"
  | "CUSTOM";

export type FulfilmentOption = "ALL" | "PENDING" | "FULFILLED";

// everything the filter bar holds (strings, so inputs stay simple)
export interface OrderFilterState {
  orderNo: string;
  productName: string;
  customer: string; // name or number
  timelineStatus: string;
  city: string;
  fulfilment: FulfilmentOption;
  dateFilter: DateFilterOption;
  year: string;
  month: string; // 1-12
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export const DEFAULT_ORDER_FILTER: OrderFilterState = {
  orderNo: "",
  productName: "",
  customer: "",
  timelineStatus: "",
  city: "",
  fulfilment: "ALL",
  dateFilter: "THIS_MONTH",
  year: String(new Date().getFullYear()),
  month: String(new Date().getMonth() + 1),
  startDate: "",
  endDate: "",
};

export interface OrderAddress {
  name?: string | null;
  contact?: string | null;
  address?: string | null;
  landMark?: string | null;
  cityDistrict?: string | null;
  state?: string | null;
  pinCode?: string | null;
}

export interface OrderUser {
  id: string;
  name?: string | null;
  phone?: string | null;
  pincode?: string | null;
}

export interface DeviceReportItem {
  conditionId: string;
  question: string;
  answer: string;
}

export interface DeviceReportSection {
  stepId: string;
  title: string;
  items: DeviceReportItem[];
}

export interface AdminSellingOrder {
  id: string;
  orderNo: string;
  productName: string;
  productImage?: string | null;
  brandName: string;
  categoryName: string;
  variantName?: string | null;
  listedPrice: number;
  quotedPriceBySystem: number;
  quotedPrice?: number | null;
  pickupCharges: number;
  processingFee: number;
  totalAmount: number;
  orderStatus: string;
  pickupMethod?: string | null;
  isDropToOffice: boolean;
  isFullFilled: boolean;
  followupStatus?: string | null;
  followupCount: number;
  serialOrIMEI?: string | null;
  additionalNotes?: string | null;
  invoiceLink?: string | null;
  createdAt: string;
  address?: OrderAddress | null;
  user?: OrderUser | null;
  timelineName?: string | null;
  timelineStatus?: string | null;
  timelineLabel?: string | null;
  timelineUpdatedAt?: string | null;
  deviceReport: DeviceReportSection[];
}

export interface AdminOrdersPage {
  orders: AdminSellingOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimelineStatusOption {
  status: string;
  label: string;
}

export type TimelineStepState = "DONE" | "CURRENT" | "NEXT" | "LOCKED";

export interface TimelineStepInfo {
  status: string;
  label: string;
  position: number;
  state: TimelineStepState;
}

export interface OrderTimelineState {
  orderNo: string;
  timelineName?: string | null;
  currentStatus?: string | null;
  steps: TimelineStepInfo[];
  events: {
    status: string;
    label: string;
    message?: string | null;
    createdAt: string;
  }[];
}
