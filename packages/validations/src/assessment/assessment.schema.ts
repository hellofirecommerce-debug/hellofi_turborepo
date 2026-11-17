import * as z from "zod";

export const stepCategoryEnum = z.enum([
  "BASICS",
  "DEVICE_DEFECTS",
  "COSMETIC_CONDITION",
  "ACCESSORIES",
  "LAPTOP_SYSTEM_CONFIG",
  "SPECIFICATION",
  "PRICING",
]);

// ─── Assessment ───
export const createAssessmentSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateAssessmentSchema = createAssessmentSchema
  .partial()
  .extend({ id: z.string().min(1) });

// ─── Assessment Step ───
export const createAssessmentStepSchema = z.object({
  assessmentId: z.string().min(1, "Assessment is required"),
  stepCategory: stepCategoryEnum,
  stepNumber: z.number().int().min(1, "Step number is required"),
  stepName: z.string().min(1, "Step name is required"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  finalStepTitle: z.string().optional(),
  priority: z.number().int().default(0),
});

export const updateAssessmentStepSchema = createAssessmentStepSchema
  .partial()
  .extend({ id: z.string().min(1) });

// ─── Types ───
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type CreateAssessmentStepInput = z.infer<
  typeof createAssessmentStepSchema
>;
export type UpdateAssessmentStepInput = z.infer<
  typeof updateAssessmentStepSchema
>;
