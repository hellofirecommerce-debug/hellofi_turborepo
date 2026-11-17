import { OrderFilterState } from "./types";

export const DATE_FILTER_OPTIONS = [
  { value: "ALL_TIME", label: "All Time" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "LAST_3_MONTHS", label: "Last 3 Months" },
  { value: "YEAR", label: "Filter by Year" },
  { value: "MONTH_YEAR", label: "Filter by Month & Year" },
  { value: "DAY", label: "Filter by Day" },
  { value: "CUSTOM", label: "Custom Date Range" },
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const trim = (v: string) => v.trim() || undefined;

// UI filter state -> GraphQL variables
export function buildFilterVariables(
  f: OrderFilterState,
  page: number,
  limit: number,
) {
  const filter: Record<string, unknown> = {
    page,
    limit,
    dateFilter: f.dateFilter,
    orderNo: trim(f.orderNo),
    productName: trim(f.productName),
    timelineStatus: f.timelineStatus || undefined,
    city: f.city || undefined,
    fulfilment: f.fulfilment !== "ALL" ? f.fulfilment : undefined,
  };

  if (f.dateFilter === "YEAR") filter.year = Number(f.year);
  if (f.dateFilter === "MONTH_YEAR") {
    filter.year = Number(f.year);
    filter.month = Number(f.month);
  }
  if (f.dateFilter === "DAY") filter.startDate = f.startDate;
  if (f.dateFilter === "CUSTOM") {
    filter.startDate = f.startDate;
    filter.endDate = f.endDate;
  }

  // one box for name or number
  const customer = f.customer.trim();
  if (customer) {
    if (/^[\d+\s-]+$/.test(customer)) {
      filter.customerNumber = customer.replace(/[\s+-]/g, "");
    } else {
      filter.customerName = customer;
    }
  }

  return { filter };
}

// "This Month (November 2026)" for the chip
export function dateFilterLabel(f: OrderFilterState) {
  const now = new Date();
  switch (f.dateFilter) {
    case "THIS_MONTH":
      return `This Month (${MONTHS[now.getMonth()]} ${now.getFullYear()})`;
    case "LAST_MONTH": {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `Last Month (${MONTHS[d.getMonth()]} ${d.getFullYear()})`;
    }
    case "LAST_3_MONTHS":
      return "Last 3 Months";
    case "YEAR":
      return `Year ${f.year}`;
    case "MONTH_YEAR":
      return `${MONTHS[Number(f.month) - 1]} ${f.year}`;
    case "DAY":
      return `Day ${f.startDate}`;
    case "CUSTOM":
      return `${f.startDate} → ${f.endDate}`;
    default:
      return "";
  }
}

const suffix = (d: number) => {
  if (d >= 11 && d <= 13) return "th";
  return ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : d % 10] ?? "th";
};

// "16th Nov 2026 - 10:56am" (IST)
export function formatCreatedAt(iso: string) {
  const d = new Date(iso);
  const tz = "Asia/Kolkata";
  const day = Number(
    d.toLocaleString("en-IN", { day: "numeric", timeZone: tz }),
  );
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: tz });
  const year = d.toLocaleString("en-GB", { year: "numeric", timeZone: tz });
  const time = d
    .toLocaleString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    })
    .replace(/\s/g, "")
    .toLowerCase();
  return `${day}${suffix(day)} ${month} ${year} - ${time}`;
}

export const formatINR = (n?: number | null) =>
  n === null || n === undefined ? "—" : `₹${n.toLocaleString("en-IN")}`;

export const formatCharge = (n: number) => (n > 0 ? formatINR(n) : "Free");

export function orderTypeLabel(order: {
  pickupMethod?: string | null;
  isDropToOffice: boolean;
}) {
  if (order.isDropToOffice) return "Drop to office";
  if (order.pickupMethod === "pickup-via-us") return "Pickup via us";
  if (order.pickupMethod === "pickup-via-staff") return "Pickup via staff";
  if (order.pickupMethod === "self") return "Self ship";
  return "N/A";
}

export const ORDER_STATUS_OPTIONS = [
  { status: "created", label: "Created" },
  { status: "paymentcompleted", label: "Payment Completed" },
  { status: "pickuprequested", label: "Pickup Requested" },
  { status: "outforpickup", label: "Out For Pickup" },
  { status: "pickupsuccessful", label: "Pickup Successful" },
  { status: "cancelled", label: "Cancelled" },
  {
    status: "productreturnedtocustomer",
    label: "Product Returned to Customer",
  },
];
