import * as z from "zod";

export const createSeriesSchema = z.object({
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  seriesName: z.string().min(1, "Series name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  priority: z.number().int().min(0).default(0),
});

export const updateSeriesSchema = createSeriesSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
