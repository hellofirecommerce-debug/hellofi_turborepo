import * as z from "zod";

export const createBuyingSpecificationSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  group: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const createBuyingVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  shortId: z.string().min(1, "Short ID is required"),
  liveLink: z.string().optional(),
  variantSubtitle: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  storage: z.string().min(1, "Storage is required"),
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
});

export const createBuyingProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productSubtitle: z.string().min(1, "Subtitle is required"),
  slug: z.string().min(1, "Slug is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  isTrending: z.boolean().default(false),
  specifications: z.array(createBuyingSpecificationSchema).default([]),
  variants: z.array(createBuyingVariantSchema).default([]),
});

export const updateBuyingProductSchema = createBuyingProductSchema
  .partial()
  .extend({
    id: z.string().min(1),
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
export type UpdateBuyingProductInput = z.infer<
  typeof updateBuyingProductSchema
>;
