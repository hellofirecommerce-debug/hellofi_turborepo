import * as z from "zod";

const BANNER_PLACEMENTS = [
  "HOME",
  "BUY_ALL",
  "BUY_MOBILE",
  "BUY_LAPTOP",
  "BUY_TABLET",
  "BUY_SMARTWATCH",
  "BUY_ACCESSORIES",
  "SELL_MOBILE",
  "SELL_LAPTOP",
  "SELL_TABLET",
  "SELL_SMARTWATCH",
  "SELL_ACCESSORIES",
] as const;

export const createBannerSchema = z.object({
  alt: z.string().min(1, "Alt text is required"),
  redirectUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  placement: z.enum(BANNER_PLACEMENTS),
  priority: z.number().int().min(0, "Priority must be a positive number"),
  isActive: z.boolean().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const updateBannerSchema = z.object({
  id: z.string().min(1),
  alt: z.string().min(1),
  redirectUrl: z.string().url().optional().or(z.literal("")),
  placement: z.enum(BANNER_PLACEMENTS),
  priority: z.number().int().min(0),
  isActive: z.boolean().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
