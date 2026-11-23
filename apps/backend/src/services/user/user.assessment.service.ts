import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";

type BrandRow = { brandId: string | null };

// one rule for steps, conditions, options and popups
//   ALL     -> always visible
//   INCLUDE -> visible only if the brand is in the list
//   EXCLUDE -> hidden if the brand is in the list
const isVisibleForBrand = (
  strategy: string,
  list: BrandRow[],
  brandId: string,
): boolean => {
  if (strategy === "ALL") return true;

  const inList = list.some((bv) => bv.brandId === brandId);

  if (strategy === "INCLUDE") return inList;
  if (strategy === "EXCLUDE") return !inList;

  return true;
};

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
              brandVisibility: true,
              conditions: {
                where: { parentOptionId: null }, // Only top-level conditions
                orderBy: { priority: "asc" },
                include: {
                  brandVisibility: true,
                  options: {
                    orderBy: { priority: "asc" },
                    include: {
                      brandVisibility: true,
                      popupConditions: {
                        orderBy: { priority: "asc" },
                        include: {
                          brandVisibility: true,
                          options: {
                            orderBy: { priority: "asc" },
                            include: { brandVisibility: true },
                          },
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

      const brandId = brand.id;

      // 3. Filter steps -> conditions -> options -> popups by brand
      const filteredSteps = assessment.steps
        .filter((step) =>
          isVisibleForBrand(
            step.brandVisibilityStrategy,
            step.brandVisibility,
            brandId,
          ),
        )
        .map((step) => {
          const visibleConditions = step.conditions.filter((condition) =>
            isVisibleForBrand(
              condition.brandVisibilityStrategy,
              condition.brandVisibility,
              brandId,
            ),
          );

          // 4. Strip out all scores from the conditions and options
          const cleanConditions = visibleConditions.map((condition) => ({
            id: condition.id,
            title: condition.title,
            subtitle: condition.subtitle,
            description: condition.description,
            conditionType: condition.conditionType,
            image: condition.image,
            icon: condition.icon,
            isRequired: condition.isRequired,
            priority: condition.priority,
            options: condition.options
              .filter((opt) =>
                isVisibleForBrand(
                  opt.brandVisibilityStrategy,
                  opt.brandVisibility,
                  brandId,
                ),
              )
              .map((opt) => ({
                id: opt.id,
                label: opt.label,
                image: opt.image,
                isRedirect: opt.isRedirect,
                redirectTo: opt.redirectTo,
                priority: opt.priority,
                popupConditions: opt.popupConditions
                  .filter((popup) =>
                    isVisibleForBrand(
                      popup.brandVisibilityStrategy,
                      popup.brandVisibility,
                      brandId,
                    ),
                  )
                  .map((popup) => ({
                    id: popup.id,
                    title: popup.title,
                    subtitle: popup.subtitle,
                    conditionType: popup.conditionType,
                    icon: popup.icon,
                    isRequired: popup.isRequired,
                    priority: popup.priority,
                    options: popup.options
                      .filter((subOpt) =>
                        isVisibleForBrand(
                          subOpt.brandVisibilityStrategy,
                          subOpt.brandVisibility,
                          brandId,
                        ),
                      )
                      .map((subOpt) => ({
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
