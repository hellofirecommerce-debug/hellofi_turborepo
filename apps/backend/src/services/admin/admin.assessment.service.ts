import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  createAssessmentStepSchema,
  updateAssessmentStepSchema,
} from "@repo/validations";

const assessmentInclude = {
  category: true,
  steps: {
    orderBy: { stepNumber: "asc" as const },
  },
};

class AdminAssessmentService {
  // ─────────────────────────────────────────────
  // ASSESSMENTS
  // ─────────────────────────────────────────────
  async getAssessments(filter?: { categoryId?: string }) {
    try {
      const where: any = { isActive: true };
      if (filter?.categoryId) where.categoryId = filter.categoryId;

      const [items, total] = await Promise.all([
        prisma.assessment.findMany({
          where,
          include: assessmentInclude,
          orderBy: { createdAt: "desc" },
        }),
        prisma.assessment.count({ where }),
      ]);

      return { items, total };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getAssessmentById(id: string) {
    try {
      const assessment = await prisma.assessment.findUnique({
        where: { id },
        include: {
          category: true,
          steps: {
            orderBy: { stepNumber: "asc" },
            include: {
              conditions: {
                where: { parentOptionId: null }, // 👈 Only get top-level conditions, not popups
                orderBy: { priority: "asc" },
                include: {
                  options: {
                    orderBy: { priority: "asc" },
                    include: {
                      // 👇 Include the popup condition and its options
                      popupConditions: {
                        include: {
                          options: { orderBy: { priority: "asc" } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!assessment) return throwNotFoundError("Assessment not found");
      return assessment;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getAssessmentByCategory(categoryId: string) {
    try {
      return await prisma.assessment.findFirst({
        where: { categoryId, isActive: true },
        include: {
          steps: {
            orderBy: { stepNumber: "asc" },
            include: {
              conditions: {
                where: { parentOptionId: null }, // 👈 Only get top-level conditions
                orderBy: { priority: "asc" },
                include: {
                  options: {
                    orderBy: { priority: "asc" },
                    include: {
                      // 👇 Include the popup condition and its options
                      popupConditions: {
                        include: {
                          options: { orderBy: { priority: "asc" } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createAssessment(input: any) {
    try {
      const validated = validateOrThrow(createAssessmentSchema, input);

      const existing = await prisma.assessment.findFirst({
        where: { categoryId: validated.categoryId, isActive: true },
      });
      if (existing) {
        return throwInputError(
          "An assessment already exists for this category",
        );
      }

      return await prisma.assessment.create({
        data: validated,
        include: assessmentInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateAssessment(input: any) {
    try {
      const validated = validateOrThrow(updateAssessmentSchema, input);
      const { id, ...data } = validated;

      const existing = await prisma.assessment.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Assessment not found");

      return await prisma.assessment.update({
        where: { id },
        data,
        include: assessmentInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteAssessment(id: string) {
    try {
      const existing = await prisma.assessment.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Assessment not found");

      await prisma.assessment.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: "Assessment deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // ─────────────────────────────────────────────
  // STEPS
  // ─────────────────────────────────────────────
  async getSteps(filter?: { assessmentId?: string }) {
    try {
      const where: any = {};
      if (filter?.assessmentId) where.assessmentId = filter.assessmentId;

      const [items, total] = await Promise.all([
        prisma.assessmentStep.findMany({
          where,
          orderBy: [{ assessmentId: "asc" }, { stepNumber: "asc" }],
          include: { assessment: true },
        }),
        prisma.assessmentStep.count({ where }),
      ]);
      return { items, total };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getStepById(id: string) {
    try {
      const step = await prisma.assessmentStep.findUnique({
        where: { id },
        include: {
          assessment: true,
          conditions: {
            where: { parentOptionId: null }, // 👈 Only get top-level conditions
            orderBy: { priority: "asc" },
            include: {
              options: {
                orderBy: { priority: "asc" },
                include: {
                  // 👇 Include the popup condition
                  popupConditions: {
                    include: {
                      options: { orderBy: { priority: "asc" } },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!step) return throwNotFoundError("Step not found");
      return step;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createStep(input: any) {
    try {
      const validated = validateOrThrow(createAssessmentStepSchema, input);

      const assessment = await prisma.assessment.findUnique({
        where: { id: validated.assessmentId },
      });
      if (!assessment) return throwNotFoundError("Assessment not found");

      const step = await prisma.assessmentStep.create({
        data: validated,
        include: { conditions: true },
      });

      await prisma.assessment.update({
        where: { id: validated.assessmentId },
        data: { totalSteps: { increment: 1 } },
      });

      return step;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateStep(input: any) {
    try {
      const validated = validateOrThrow(updateAssessmentStepSchema, input);
      const { id, ...data } = validated;

      const step = await prisma.assessmentStep.findUnique({ where: { id } });
      if (!step) return throwNotFoundError("Step not found");

      return await prisma.assessmentStep.update({
        where: { id },
        data,
        include: { conditions: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteStep(id: string) {
    try {
      const step = await prisma.assessmentStep.findUnique({ where: { id } });
      if (!step) return throwNotFoundError("Step not found");

      await prisma.assessmentStep.delete({ where: { id } });
      await prisma.assessment.update({
        where: { id: step.assessmentId },
        data: { totalSteps: { decrement: 1 } },
      });
      return { message: "Step deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminAssessmentService();
