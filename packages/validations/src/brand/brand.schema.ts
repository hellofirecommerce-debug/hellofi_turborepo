import * as z from "zod";

export const brandCategoryItemSchema = z.object({
  categoryId: z.string().min(1),
  priority: z.number().int().min(0),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const createBrandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  seoName: z.string().min(1, "SEO name is required"),
  brandCategories: z
    .array(brandCategoryItemSchema)
    .min(1, "Select at least one category"),
});

export const updateBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  seoName: z.string().min(1),
  brandCategories: z.array(brandCategoryItemSchema).min(1),
});

// Separate schema for BrandCategory
export const addBrandCategorySchema = z.object({
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  priority: z.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateBrandCategorySchema = z.object({
  priority: z.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type AddBrandCategoryInput = z.infer<typeof addBrandCategorySchema>;
export type UpdateBrandCategoryInput = z.infer<
  typeof updateBrandCategorySchema
>;
