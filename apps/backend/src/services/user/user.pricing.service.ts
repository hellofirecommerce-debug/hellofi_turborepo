import prisma from "@repo/db";
import { roundToNearestTen } from "../../lib/utils/priceRounding";

export interface SelectedAnswer {
  stepId: string;
  conditionId: string;
  optionId: string;
}

class UserPricingService {
  async evaluateQuote(input: {
    productId: string;
    variantId?: string | null;
    answers: SelectedAnswer[];
  }) {
    const { productId, variantId, answers } = input;

    const product = await prisma.sellingProduct.findUnique({
      where: { id: productId },
      include: {
        brand: true,
        category: true,
        variants: variantId ? { where: { id: variantId } } : true,
      },
    });

    if (!product) throw new Error("Product not found");

    const variant = variantId
      ? product.variants[0]
      : (product.variants[0] ?? null);
    if (variantId && !variant) throw new Error("Variant not found");

    const basePrice = variant?.productPrice ?? product.productPrice ?? 0;

    const assessment = await prisma.assessment.findFirst({
      where: { categoryId: product.categoryId, isActive: true },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
          include: {
            conditions: {
              where: {
                OR: [
                  { brandVisibilityStrategy: "ALL" },
                  {
                    brandVisibilityStrategy: "INCLUDE",
                    brandVisibility: { some: { brandId: product.brandId } },
                  },
                  {
                    brandVisibilityStrategy: "EXCLUDE",
                    brandVisibility: { none: { brandId: product.brandId } },
                  },
                ],
              },
              include: {
                options: { orderBy: { priority: "asc" } },
                conditionRules: {
                  include: { triggers: true, ruleBrands: true },
                },
              },
            },
          },
        },
      },
    });

    if (!assessment)
      throw new Error("Assessment not configured for this category");

    const optionIndex = new Map<
      string,
      { option: any; condition: any; step: any }
    >();
    for (const step of assessment.steps) {
      for (const condition of step.conditions) {
        for (const option of condition.options) {
          optionIndex.set(option.id, { option, condition, step });
        }
      }
    }

    const breakdown: any[] = [];
    let totalDeduction = 0;
    let totalAddition = 0;
    const selectedOptionIds = new Set<string>();

    for (const ans of answers) {
      const entry = optionIndex.get(ans.optionId);
      if (!entry) continue;

      const { option, condition, step } = entry;
      selectedOptionIds.add(option.id);

      const brandScore = await prisma.optionBrandScore.findUnique({
        where: {
          optionId_brandId: { optionId: option.id, brandId: product.brandId },
        },
      });

      const score = brandScore?.score ?? option.score;
      const action = brandScore?.action ?? option.action;
      const scoreType = brandScore?.scoreType ?? option.scoreType;

      const appliedValue = this.computeValue(
        basePrice,
        score,
        scoreType,
        action,
      );

      if (action === "DECREMENT") totalDeduction += Math.abs(appliedValue);
      if (action === "INCREMENT") totalAddition += appliedValue;

      breakdown.push({
        stepId: step.id,
        stepName: step.stepName,
        conditionId: condition.id,
        conditionTitle: condition.title,
        optionId: option.id,
        optionLabel: option.label,
        score,
        scoreType,
        action,
        appliedValue,
      });
    }

    const ruleLines = await this.applyConditionRules({
      assessment,
      basePrice,
      productBrandId: product.brandId,
      selectedOptionIds,
    });

    for (const line of ruleLines) {
      breakdown.push(line);
      if (line.action === "DECREMENT")
        totalDeduction += Math.abs(line.appliedValue);
      if (line.action === "INCREMENT") totalAddition += line.appliedValue;
    }

    const finalQuote = roundToNearestTen(
      basePrice - totalDeduction + totalAddition,
    );

    return {
      productId,
      variantId: variant?.id ?? null,
      basePrice,
      finalQuote,
      breakdown,
      totalDeduction,
      totalAddition,
    };
  }

  private computeValue(
    basePrice: number,
    score: number,
    scoreType: string,
    action: string,
  ): number {
    if (action === "REDIRECT" || action === "NONE" || score === 0) return 0;
    let value = 0;
    if (scoreType === "PER") value = (basePrice * score) / 100;
    else if (scoreType === "RUPPEE") value = score;
    else if (scoreType === "MUL") value = basePrice * score;
    return Math.round(value);
  }

  private async applyConditionRules(args: any) {
    const { assessment, basePrice, productBrandId, selectedOptionIds } = args;
    const results: any[] = [];

    for (const step of assessment.steps) {
      for (const condition of step.conditions) {
        for (const rule of condition.conditionRules ?? []) {
          if (rule.ruleBrandStrategy === "INCLUDE") {
            if (!rule.ruleBrands.some((b: any) => b.brandId === productBrandId))
              continue;
          } else if (rule.ruleBrandStrategy === "EXCLUDE") {
            if (rule.ruleBrands.some((b: any) => b.brandId === productBrandId))
              continue;
          }

          if (!this.evaluateTriggers(rule.triggers, selectedOptionIds))
            continue;

          if (rule.targetOptionId) {
            const targetOption = await prisma.sellingOption.findUnique({
              where: { id: rule.targetOptionId },
            });
            if (!targetOption) continue;

            const appliedValue = this.computeValue(
              basePrice,
              targetOption.score,
              rule.highestScoreType,
              rule.highestAction,
            );

            results.push({
              stepId: step.id,
              stepName: step.stepName,
              conditionId: condition.id,
              conditionTitle: condition.title,
              optionId: targetOption.id,
              optionLabel: `[Rule] ${rule.ruleName ?? "Adjustment"} → ${targetOption.label}`,
              score: targetOption.score,
              scoreType: rule.highestScoreType,
              action: rule.highestAction,
              appliedValue:
                rule.highestAction === "DECREMENT"
                  ? -appliedValue
                  : appliedValue,
            });
          }
        }
      }
    }
    return results;
  }

  private evaluateTriggers(
    triggers: any[],
    selectedOptionIds: Set<string>,
  ): boolean {
    if (!triggers || triggers.length === 0) return false;
    const andTriggers = triggers.filter((t) => t.logic === "AND");
    const orTriggers = triggers.filter((t) => t.logic === "OR");

    for (const t of andTriggers) {
      if (!selectedOptionIds.has(t.optionId)) return false;
    }
    if (orTriggers.length > 0) {
      return orTriggers.some((t) => selectedOptionIds.has(t.optionId));
    }
    return true;
  }
}

export default new UserPricingService();
