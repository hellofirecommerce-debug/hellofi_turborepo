import * as z from "zod";

// ─── Sub-Condition (the popup container) ───
export const createSubConditionSchema = z.object({
  parentConditionId: z.string().min(1, "Parent condition is required"),
  parentOptionId: z.string().min(1, "Parent option is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  conditionType: z
    .enum(["BOOLEAN", "RADIO", "MULTI_SELECT", "DROPDOWN"])
    .default("RADIO"),
  priority: z.number().int().default(0),
});

export const updateSubConditionSchema = createSubConditionSchema
  .partial()
  .extend({ id: z.string().min(1) });

// ─── Sub-Option (the pills inside the popup) ───
export const createSubOptionSchema = z.object({
  subConditionId: z.string().min(1, "Sub-condition is required"),
  label: z.string().min(1, "Label is required"),
  score: z.number().int().default(0),
  scoreType: z.enum(["PER", "RUPPEE", "MUL"]).default("PER"),
  action: z
    .enum(["INCREMENT", "DECREMENT", "REDIRECT", "NONE"])
    .default("NONE"),
  priority: z.number().int().default(0),
  description: z.string().optional(),
});

export const updateSubOptionSchema = createSubOptionSchema
  .partial()
  .extend({ id: z.string().min(1) });

export const subConditionFilterSchema = z.object({
  parentConditionId: z.string().optional(),
  parentOptionId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(20),
});

export type CreateSubConditionInput = z.infer<typeof createSubConditionSchema>;
export type UpdateSubConditionInput = z.infer<typeof updateSubConditionSchema>;
export type CreateSubOptionInput = z.infer<typeof createSubOptionSchema>;
export type UpdateSubOptionInput = z.infer<typeof updateSubOptionSchema>;
export type SubConditionFilterInput = z.infer<typeof subConditionFilterSchema>;
