import * as z from "zod";
import { scoreTypeEnum } from "./option.schema";

export const ruleLogicEnum = z.enum([
  "SKIP_ALL_OPTIONS",
  "APPLY_ONLY_SPECIFIC_OPTIONS",
  "SKIP_SELF",
  "APPLY_HIGHEST_PERCENTAGE",
]);

export const brandStrategyEnum = z.enum(["INCLUDE", "EXCLUDE", "ALL"]);
export const scoreActionEnum = z.enum(["INCREMENT", "DECREMENT"]);

// ─── Condition Rule ───
const triggerSchema = z.object({
  conditionId: z.string().min(1),
  optionId: z.string().min(1),
  logic: z.enum(["AND", "OR"]).default("OR"),
});

export const createConditionRuleSchema = z.object({
  conditionId: z.string().min(1, "Condition is required"),
  ruleName: z.string().optional(),
  description: z.string().optional(),
  ruleLogic: ruleLogicEnum,
  ruleBrandStrategy: brandStrategyEnum.default("ALL"),
  targetConditionId: z.string().optional(),
  highestScoreType: scoreTypeEnum.default("PER"),
  highestAction: scoreActionEnum.default("DECREMENT"),
  targetOptionId: z.string().optional(),
  triggers: z.array(triggerSchema).optional(),
});

export const updateConditionRuleSchema = createConditionRuleSchema
  .partial()
  .extend({ id: z.string().min(1) });

export const conditionRuleFilterSchema = z.object({
  conditionId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(20),
});

// ─── Brand / Series / Product Score Overrides ───
export const createBrandScoreSchema = z.object({
  optionId: z.string().min(1),
  brandId: z.string().min(1),
  brandName: z.string().optional(),
  score: z.number().int(),
  scoreType: scoreTypeEnum,
  action: scoreActionEnum,
});

export const createSeriesScoreSchema = z.object({
  optionId: z.string().min(1),
  seriesId: z.string().min(1),
  seriesName: z.string().optional(),
  score: z.number().int(),
  scoreType: scoreTypeEnum,
  action: scoreActionEnum,
});

export const createProductScoreSchema = z.object({
  optionId: z.string().min(1),
  productId: z.string().min(1),
  productName: z.string().optional(),
  score: z.number().int(),
  scoreType: scoreTypeEnum,
  action: scoreActionEnum,
});

// ─── Types ───
export type CreateConditionRuleInput = z.infer<
  typeof createConditionRuleSchema
>;
export type UpdateConditionRuleInput = z.infer<
  typeof updateConditionRuleSchema
>;
export type ConditionRuleFilterInput = z.infer<
  typeof conditionRuleFilterSchema
>;
export type CreateBrandScoreInput = z.infer<typeof createBrandScoreSchema>;
export type CreateSeriesScoreInput = z.infer<typeof createSeriesScoreSchema>;
export type CreateProductScoreInput = z.infer<typeof createProductScoreSchema>;
