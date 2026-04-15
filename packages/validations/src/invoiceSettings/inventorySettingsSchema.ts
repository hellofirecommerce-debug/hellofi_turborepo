import * as z from "zod";

export const createInvoiceSettingsSchema = z.object({
  label: z.string().min(1, "Label is required"),
  isDefault: z.boolean().default(false),

  // Company Details
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email"),
  gstin: z.string().min(1, "GSTIN is required"),
  logoUrl: z.string().optional(),
  stampUrl: z.string().optional(),

  // Default Terms
  defaultInvoiceTermsBrand: z.string().min(1, "Brand warranty terms required"),
  defaultInvoiceTermsHellofi: z
    .string()
    .min(1, "HelloFi warranty terms required"),
  defaultInvoiceTermsNone: z.string().min(1, "No warranty terms required"),
  defaultBankDetails: z.string().min(1, "Bank details required"),
});

export const updateInvoiceSettingsSchema = createInvoiceSettingsSchema.extend({
  id: z.string().min(1),
});

export type CreateInvoiceSettingsInput = z.infer<
  typeof createInvoiceSettingsSchema
>;
export type UpdateInvoiceSettingsInput = z.infer<
  typeof updateInvoiceSettingsSchema
>;
