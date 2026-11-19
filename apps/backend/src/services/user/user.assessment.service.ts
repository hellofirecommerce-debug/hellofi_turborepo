import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";

class UserAssessmentService {
  async getAssessmentFlow(
    categorySlug: string,
    brandSlug: string,
    _productSlug: string,
  ) {
    try {
      // 1. Find the Brand and Category by their SEO slugs
      const brand = await prisma.brand.findUnique({
        where: { seoName: brandSlug },
      });

      const category = await prisma.category.findUnique({
        where: { seoName: categorySlug },
      });

      if (!brand || !category) {
        return throwNotFoundError("Brand or Category not found");
      }

      // 2. Find the Assessment for this Category
      const assessment = await prisma.assessment.findFirst({
        where: { categoryId: category.id, isActive: true },
        include: {
          steps: {
            orderBy: { stepNumber: "asc" },
            include: {
              conditions: {
                where: { parentOptionId: null }, // Only top-level conditions
                orderBy: { priority: "asc" },
                include: {
                  brandVisibility: true,
                  options: {
                    orderBy: { priority: "asc" },
                    include: {
                      popupConditions: {
                        orderBy: { priority: "asc" },
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

      if (!assessment) {
        return throwNotFoundError("Assessment not found for this category");
      }

      // 3. Filter Conditions based on Brand Visibility
      const filteredSteps = assessment.steps.map((step) => {
        const filteredConditions = step.conditions.filter((condition) => {
          if (condition.brandVisibilityStrategy === "ALL") return true;

          const isBrandInList = condition.brandVisibility.some(
            (bv) => bv.brandId === brand.id,
          );

          if (condition.brandVisibilityStrategy === "INCLUDE") {
            return isBrandInList;
          }
          if (condition.brandVisibilityStrategy === "EXCLUDE") {
            return !isBrandInList;
          }
          return true;
        });

        // 4. Strip out all scores from the conditions and options
        const cleanConditions = filteredConditions.map((condition) => ({
          id: condition.id,
          title: condition.title,
          subtitle: condition.subtitle,
          description: condition.description,
          conditionType: condition.conditionType,
          image: condition.image,
          icon: condition.icon,
          isRequired: condition.isRequired,
          priority: condition.priority,
          options: condition.options.map((opt) => ({
            id: opt.id,
            label: opt.label,
            image: opt.image,
            isRedirect: opt.isRedirect,
            redirectTo: opt.redirectTo,
            priority: opt.priority,
            popupConditions: opt.popupConditions.map((popup) => ({
              id: popup.id,
              title: popup.title,
              subtitle: popup.subtitle,
              conditionType: popup.conditionType,
              icon: popup.icon,
              isRequired: popup.isRequired,
              priority: popup.priority,
              options: popup.options.map((subOpt) => ({
                id: subOpt.id,
                label: subOpt.label,
                image: subOpt.image,
                priority: subOpt.priority,
              })),
            })),
          })),
        }));

        return {
          id: step.id,
          stepName: step.stepName,
          stepCategory: step.stepCategory,
          stepNumber: step.stepNumber,
          title: step.title,
          subtitle: step.subtitle,
          description: step.description,
          conditions: cleanConditions,
        };
      });

      return {
        assessmentId: assessment.id,
        assessmentName: assessment.name,
        steps: filteredSteps,
      };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new UserAssessmentService();
