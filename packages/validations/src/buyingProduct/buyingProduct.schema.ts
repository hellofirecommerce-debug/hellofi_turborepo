import * as z from "zod";

export const createBuyingSpecificationSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  group: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const createBuyingVariantSchema = z.object({
  variantSubtitle: z.string().min(1, "Variant subtitle is required"),
  inventoryProductId: z.string().optional(),
  liveLink: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  price: z.number().min(0),
  mrp: z.number().min(0),
  emiBasePrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0),
  productSpec: z.string().optional(),
  condition: z.enum(["UNBOXED", "SUPERB", "GOOD", "FAIR", "PARTIALLY_FAIR"]),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).default("IN_STOCK"),
  screenSize: z.string().optional(),
  os: z.enum(["WINDOWS", "MACOS"]).optional(),
  processor: z.string().optional(),
  batteryCapacity: z.string().optional(),
  warrantyType: z.enum(["HELLOFI_WARRANTY", "BRAND_WARRANTY", "NO_WARRANTY"]),
  warrantyDescription: z.string().optional(),
  whatsInTheBox: z.array(z.string()).default([]),
  whatsExtra: z.string().optional(),
  variantKey: z.string().optional(),
});

export const createBuyingProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productSubtitle: z.string().min(1, "Subtitle is required"),
  slug: z.string().min(1, "Slug is required"),
  brandId: z.string().optional(),
  manualBrand: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isTrending: z.boolean().default(false),
  specifications: z.array(createBuyingSpecificationSchema).default([]),
  variants: z.array(createBuyingVariantSchema).default([]),
});

// ── Separate update variant schema — variantKey required as the identifier ──
export const updateBuyingVariantSchema = z.object({
  variantKey: z.string().min(1),
  variantSubtitle: z.string().optional(),
  inventoryProductId: z.string().optional().nullable(),
  liveLink: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  colorCode: z.string().optional().nullable(),
  storage: z.string().optional().nullable(),
  ram: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  mrp: z.number().min(0).optional(),
  emiBasePrice: z.number().min(0).optional().nullable(),
  quantity: z.number().int().min(0).optional(),
  productSpec: z.string().optional().nullable(),
  condition: z
    .enum(["UNBOXED", "SUPERB", "GOOD", "FAIR", "PARTIALLY_FAIR"])
    .optional(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
  screenSize: z.string().optional().nullable(),
  os: z.enum(["WINDOWS", "MACOS"]).optional().nullable(),
  processor: z.string().optional().nullable(),
  batteryCapacity: z.string().optional().nullable(),
  warrantyType: z
    .enum(["HELLOFI_WARRANTY", "BRAND_WARRANTY", "NO_WARRANTY"])
    .optional(),
  warrantyDescription: z.string().optional().nullable(),
  whatsInTheBox: z.array(z.string()).optional(),
  whatsExtra: z.string().optional().nullable(),
});

// ── Update product schema — variants use updateBuyingVariantSchema ──
export const updateBuyingProductSchema = z.object({
  id: z.string().min(1),
  productName: z.string().optional(),
  productSubtitle: z.string().optional(),
  slug: z.string().optional(),
  brandId: z.string().optional().nullable(),
  manualBrand: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  isTrending: z.boolean().optional(),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1),
        value: z.string().min(1),
        group: z.string().optional().nullable(),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
  variants: z.array(updateBuyingVariantSchema).optional(),
});

export type CreateBuyingVariantInput = z.infer<
  typeof createBuyingVariantSchema
>;
export type CreateBuyingSpecificationInput = z.infer<
  typeof createBuyingSpecificationSchema
>;
export type CreateBuyingProductInput = z.infer<
  typeof createBuyingProductSchema
>;
export type UpdateBuyingVariantInput = z.infer<
  typeof updateBuyingVariantSchema
>;
export type UpdateBuyingProductInput = z.infer<
  typeof updateBuyingProductSchema
>;
