import * as z from "zod";
import { paymentModeEnum } from "../inventoryProduct/inventoryProduct.schema";

export const saleTypeEnum = z.enum(["DIRECT", "EXCHANGE"]);
export const invoiceWarrantyTypeEnum = z.enum(["BRAND", "HELLOFI", "NONE"]);
export const invoiceStatusEnum = z.enum(["DRAFT", "FINALIZED", "CANCELLED"]);

export const createInvoiceItemSchema = z.object({
  inventoryProductId: z.string().optional(),
  product: z.string().min(1, "Product name is required"),
  serialNumber: z.string().optional(),
  hsnSac: z.string().optional(),
  qty: z.number().min(1),
  uom: z.string().min(1),
  rate: z.number().min(0),
  total: z.number().min(0),
  discount: z.number().min(0).default(0),
  gross: z.number().min(0),
  gstAmount: z.number().min(0).default(0),
  cgstPercent: z.number().min(0).default(0),
  cgstAmount: z.number().min(0).default(0),
  sgstPercent: z.number().min(0).default(0),
  sgstAmount: z.number().min(0).default(0),
  igstPercent: z.number().min(0).default(0),
  igstAmount: z.number().min(0).default(0),
  sortOrder: z.number().default(0),
});

export const createExchangeItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  ram: z.string().optional(),
  storage: z.string().optional(),
  exchangeValue: z.number().min(0).default(0),
});
export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  invoiceDate: z.string().min(1),
  companySettingsId: z.string().min(1),

  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientContact: z.string().min(1, "Client contact is required"),
  clientGstin: z.string().optional(),
  isInsideBangalore: z.boolean().default(true),
  paidBy: paymentModeEnum.optional(), // ← changed from z.string().optional()
  splitPaymentDetails: z.string().optional(), // ← add this

  saleType: saleTypeEnum.default("DIRECT"),
  warrantyType: invoiceWarrantyTypeEnum.default("BRAND"),
  warrantyMonths: z.number().optional(),

  grossValue: z.number().min(0),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  exchangeValue: z.number().min(0).default(0),
  amountPaid: z.number().min(0),

  cgst: z.number().min(0).default(0),
  sgst: z.number().min(0).default(0),
  igst: z.number().min(0).default(0),

  invoiceTerms: z.string().min(1),
  bankDetails: z.string().min(1),

  items: z.array(createInvoiceItemSchema).min(1),
  exchangeItems: z.array(createExchangeItemSchema).default([]),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  id: z.string().min(1),
  invoiceTerms: z.string().optional(),
  bankDetails: z.string().optional(),
  exchangeItems: z.array(createExchangeItemSchema).optional(),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type CreateInvoiceItemInput = z.infer<typeof createInvoiceItemSchema>;
export type CreateExchangeItemInput = z.infer<typeof createExchangeItemSchema>;
