import * as z from "zod";

export const optionActionEnum = z.enum([
  "INCREMENT",
  "DECREMENT",
  "REDIRECT",
  "NONE",
]);

export const scoreTypeEnum = z.enum(["PER", "RUPPEE", "MUL"]);

// local (not exported) so it can't clash with the condition validations
const brandVisibilityStrategySchema = z.enum(["ALL", "INCLUDE", "EXCLUDE"]);
const brandVisibilityItemSchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().optional(),
});

export const createOptionSchema = z.object({
  conditionId: z.string().min(1, "Condition is required"),
  label: z.string().min(1, "Label is required"),
  action: optionActionEnum.default("NONE"),
  score: z.number().int().default(0),
  scoreType: scoreTypeEnum.default("PER"),
  isRedirect: z.boolean().default(false),
  redirectTo: z.string().optional(),
  priority: z.number().int().default(0),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  brandVisibilityStrategy: brandVisibilityStrategySchema.optional(),
  brandVisibility: z.array(brandVisibilityItemSchema).optional(),
});

export const updateOptionSchema = createOptionSchema
  .partial()
  .extend({ id: z.string().min(1) });

export const optionFilterSchema = z.object({
  categoryId: z.string().optional(),
  assessmentId: z.string().optional(),
  stepId: z.string().optional(),
  conditionId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(500).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateOptionInput = z.infer<typeof createOptionSchema>;
export type UpdateOptionInput = z.infer<typeof updateOptionSchema>;
export type OptionFilterInput = z.infer<typeof optionFilterSchema>;
