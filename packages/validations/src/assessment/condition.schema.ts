import * as z from "zod";

export const conditionTypeEnum = z.enum([
  "BOOLEAN",
  "RADIO",
  "MULTI_SELECT",
  "MULTI_SELECT_INVERTED", // 👈 Add this
  "DROPDOWN",
]);

export const brandVisibilityEnum = z.enum(["INCLUDE", "EXCLUDE", "ALL"]);

const brandVisibilityEntrySchema = z.object({
  brandId: z.string().optional(),
  brandName: z.string().optional(),
});

export const createConditionSchema = z.object({
  stepId: z.string().min(1, "Step is required"),
  parentOptionId: z.string().optional().nullable(), // 👈 ADD THIS
  conditionType: conditionTypeEnum.default("RADIO"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  finalConditionName: z.string().optional(),
  priority: z.number().int().default(0),
  applicableFromDate: z.string().optional(),
  icon: z.string().nullable().optional(),
  isRequired: z.boolean().optional(),
  brandVisibilityStrategy: brandVisibilityEnum.default("ALL"),
  brandVisibility: z.array(brandVisibilityEntrySchema).optional(),
});

export const updateConditionSchema = createConditionSchema
  .partial()
  .extend({ id: z.string().min(1) });

export const conditionFilterSchema = z.object({
  stepId: z.string().optional(),
  assessmentId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(20),
});

export type CreateConditionInput = z.infer<typeof createConditionSchema>;
export type UpdateConditionInput = z.infer<typeof updateConditionSchema>;
export type ConditionFilterInput = z.infer<typeof conditionFilterSchema>;
