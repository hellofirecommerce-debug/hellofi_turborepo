import * as z from "zod";

export const createSellingVariantSchema = z.object({
  ram: z.string().optional(),
  storage: z.string().min(1, "Storage is required"),
  productPrice: z.number().min(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const createSellingProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productSeoName: z.string().min(1, "SEO name is required"),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  seriesId: z.string().min(1, "Series is required"),
  releasedYear: z.number().int().optional(),
  launchedDate: z.string().optional(),
  productPrice: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  hasVariants: z.boolean().default(false),
  isConstantRam: z.boolean().default(false),
  ram: z.string().optional(),
  variants: z.array(createSellingVariantSchema).default([]),
});

export const updateSellingProductSchema = createSellingProductSchema
  .partial()
  .extend({
    id: z.string().min(1),
  });

export type CreateSellingVariantInput = z.infer<
  typeof createSellingVariantSchema
>;
export type CreateSellingProductInput = z.infer<
  typeof createSellingProductSchema
>;
export type UpdateSellingProductInput = z.infer<
  typeof updateSellingProductSchema
>;
