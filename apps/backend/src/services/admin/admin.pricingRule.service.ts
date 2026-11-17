import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createConditionRuleSchema,
  updateConditionRuleSchema,
  createBrandScoreSchema,
  createSeriesScoreSchema,
  createProductScoreSchema,
} from "@repo/validations";

const ruleInclude = {
  condition: { select: { id: true, title: true } },
  targetCondition: { select: { id: true, title: true } },
  targetOption: { select: { id: true, label: true } },
  triggers: true,
  ruleBrands: true,
};

class AdminPricingRuleService {
  // ─────────────────────────────────────────────
  // CONDITION RULES
  // ─────────────────────────────────────────────
  async getConditionRules(filter?: {
    conditionId?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const page = filter?.page ?? 1;
      const pageSize = filter?.pageSize ?? 20;
      const skip = (page - 1) * pageSize;

      const where: any = {};
      if (filter?.conditionId) where.conditionId = filter.conditionId;

      const [items, total] = await Promise.all([
        prisma.conditionRule.findMany({
          where,
          include: ruleInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.conditionRule.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getConditionRuleById(id: string) {
    try {
      const rule = await prisma.conditionRule.findUnique({
        where: { id },
        include: ruleInclude,
      });
      if (!rule) return throwNotFoundError("Rule not found");
      return rule;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createConditionRule(input: any) {
    try {
      const validated = validateOrThrow(createConditionRuleSchema, input);
      const { triggers, ...data } = validated;

      return await prisma.conditionRule.create({
        data: {
          ...data,
          triggers: triggers
            ? { create: triggers.map((t) => ({ ...t })) }
            : undefined,
        },
        include: ruleInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateConditionRule(input: any) {
    try {
      const validated = validateOrThrow(updateConditionRuleSchema, input);
      const { id, triggers, ...data } = validated;

      const existing = await prisma.conditionRule.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Rule not found");

      if (triggers) {
        await prisma.conditionRuleTrigger.deleteMany({ where: { ruleId: id } });
      }

      return await prisma.conditionRule.update({
        where: { id },
        data: {
          ...data,
          triggers: triggers
            ? { create: triggers.map((t) => ({ ...t })) }
            : undefined,
        },
        include: ruleInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteConditionRule(id: string) {
    try {
      const existing = await prisma.conditionRule.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Rule not found");

      await prisma.conditionRule.delete({ where: { id } });
      return { message: "Rule deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // ─────────────────────────────────────────────
  // BRAND SCORES
  // ─────────────────────────────────────────────
  async createBrandScore(input: any) {
    try {
      const validated = validateOrThrow(createBrandScoreSchema, input);
      return await prisma.optionBrandScore.create({ data: validated });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteBrandScore(id: string) {
    try {
      const existing = await prisma.optionBrandScore.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Brand score not found");

      await prisma.optionBrandScore.delete({ where: { id } });
      return { message: "Brand score deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // ─────────────────────────────────────────────
  // SERIES SCORES
  // ─────────────────────────────────────────────
  async createSeriesScore(input: any) {
    try {
      const validated = validateOrThrow(createSeriesScoreSchema, input);
      return await prisma.optionSeriesScore.create({ data: validated });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteSeriesScore(id: string) {
    try {
      const existing = await prisma.optionSeriesScore.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Series score not found");

      await prisma.optionSeriesScore.delete({ where: { id } });
      return { message: "Series score deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // ─────────────────────────────────────────────
  // PRODUCT SCORES
  // ─────────────────────────────────────────────
  async createProductScore(input: any) {
    try {
      const validated = validateOrThrow(createProductScoreSchema, input);
      return await prisma.optionProductScore.create({ data: validated });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteProductScore(id: string) {
    try {
      const existing = await prisma.optionProductScore.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Product score not found");

      await prisma.optionProductScore.delete({ where: { id } });
      return { message: "Product score deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminPricingRuleService();
