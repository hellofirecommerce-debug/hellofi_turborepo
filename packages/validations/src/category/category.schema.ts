import * as z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  seoName: z.string().min(1, "SEO name is required"),
  categoryType: z.string().min(1, "Category type is required"),
  priority: z.number().int().min(0, "Priority must be a positive number"),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  seoName: z.string().min(1),
  categoryType: z.string().min(1),
  priority: z.number().int().min(0),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
