import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";

class UserAssessmentService {
  async getAssessmentFlow(
    categorySlug: string,
    brandSlug: string,
    productSlug: string,
  ) {
    try {
      // 1. Find the Brand and Category by their SEO slugs
      const brand = await prisma.brand.findUnique({
        where: { seoName: brandSlug },
      });

      const category = await prisma.category.findUnique({
        where: { seoName: categorySlug },
      });
      console.log("This is the category slug:", categorySlug);

      if (!brand || !category) {
        return throwNotFoundError("Brand or Category not found");
      }

      // 2. Find the Product (variant) using the slug
      // Note: Adjust the matching logic based on how your productSlug is constructed.
      // Usually, the slug matches the productSeoName + ram + storage.
      const product = await prisma.sellingProduct.findFirst({
        where: {
          categoryId: category.id,
          brandId: brand.id,
          // Example: If slug is "apple-iphone-17-8-gb-256-gb"
          // You might need to split the slug or use a contains query.
          // For simplicity, we assume productSeoName is the base.
          productSeoName: { contains: "iphone-17" }, // Replace with actual matching logic
        },
      });

      // If product isn't strictly needed for the assessment flow, you can skip it.

      // 3. Find the Assessment for this Category
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

      // 4. Filter Conditions based on Brand Visibility
      const filteredSteps = assessment.steps.map((step) => {
        const filteredConditions = step.conditions.filter((condition) => {
          // If strategy is ALL, include it
          if (condition.brandVisibilityStrategy === "ALL") return true;

          // Check if the current brand is in the visibility list
          const isBrandInList = condition.brandVisibility.some(
            (bv) => bv.brandId === brand.id,
          );

          // If strategy is INCLUDE, only show if brand is in the list
          if (condition.brandVisibilityStrategy === "INCLUDE") {
            return isBrandInList;
          }

          // If strategy is EXCLUDE, hide if brand is in the list
          if (condition.brandVisibilityStrategy === "EXCLUDE") {
            return !isBrandInList;
          }

          return true;
        });

        // 👇 5. Strip out all scores from the conditions and options
        // 👇 5. Strip out all scores from the conditions and options
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
            // 👇 Strip popup condition scores too
            popupConditions: opt.popupConditions.map((popup) => ({
              id: popup.id,
              title: popup.title,
              subtitle: popup.subtitle,
              conditionType: popup.conditionType,
              icon: popup.icon,
              isRequired: popup.isRequired,
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
