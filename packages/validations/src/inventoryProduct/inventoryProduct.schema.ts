import * as z from "zod";

export const inventoryStatusEnum = z.enum(["NOT_LISTED", "LISTED", "SOLD"]);

export const paymentModeEnum = z.enum([
  "CASH",
  "UPI",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "SPLIT_PAYMENT",
  "RAZORPAY",
]);

export const createInventoryProductSchema = z.object({
  // Identifiers
  imeiOrSerial: z.string().min(1, "IMEI or serial is required"),

  // Category + Brand
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),

  // Purchase Details
  purchaseDate: z.string().min(1, "Purchase date is required"),
  productName: z.string().min(1, "Product name is required"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  otherCharges: z.number().min(0).default(0),
  ram: z.string().optional(),
  storage: z.string().optional(),

  // Purchase Customer
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  customerPhone: z
    .string()
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
  customerAddress: z.string().min(1, "Customer address is required"),

  // Status
  status: inventoryStatusEnum.default("NOT_LISTED"),

  // Selling Details — optional at creation
  sellingDate: z.string().optional(),
  sellingPrice: z.number().min(0).optional(),
  invoice: z.string().optional(),

  // Selling Customer — optional
  sellingCustomerName: z.string().optional(),
  sellingCustomerEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  sellingCustomerPhone: z.string().optional(),
  sellingCustomerAddress: z.string().optional(),

  // Device Condition
  screenCondition: z.enum(["MINOR", "MAJOR", "NO"]).default("NO"),
  bodyCondition: z.enum(["MINOR", "MAJOR", "NO"]).default("NO"),
  deviceIssues: z.string().optional(),

  // Accessories
  hasBox: z.boolean().default(false),
  hasCharger: z.boolean().default(false),
  hasOriginalBill: z.boolean().default(false),

  // Warranty
  warrantyType: z
    .enum(["ABOVE_1_YEAR", "BELOW_1_YEAR"])
    .default("ABOVE_1_YEAR"),
  warrantyPurchaseDate: z.string().optional(),

  // Payment — optional
  paymentMode: paymentModeEnum.optional(),
  receivedInBank: z.number().min(0).optional(),
  splitPaymentDetails: z.string().optional(),

  // Metadata
  notes: z.string().optional(),
});

export const updateInventoryProductSchema = createInventoryProductSchema.extend(
  {
    id: z.string().min(1),
  },
);

export const markAsSoldSchema = z.object({
  id: z.string().min(1),
  sellingDate: z.string().min(1, "Selling date is required"),
  sellingPrice: z.number().min(1, "Selling price is required"),
  sellingCustomerName: z.string().min(1, "Customer name is required"),
  sellingCustomerEmail: z.string().email().optional().or(z.literal("")),
  sellingCustomerPhone: z
    .string()
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
  sellingCustomerAddress: z.string().min(1, "Customer address is required"),
  paymentMode: paymentModeEnum,
  receivedInBank: z.number().min(0, "Received in bank is required"), // ← required now
  sellingOtherCharges: z.number().min(0).default(0), // ← new field
  splitPaymentDetails: z.string().optional(), // ← only for split
});

export type CreateInventoryProductInput = z.infer<
  typeof createInventoryProductSchema
>;
export type UpdateInventoryProductInput = z.infer<
  typeof updateInventoryProductSchema
>;
export type MarkAsSoldInput = z.infer<typeof markAsSoldSchema>;
