import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import CommonCategoryService from "./common.category.service";

class CommonBrandService {
  async getBrands() {
    try {
      return await prisma.brand.findMany({
        include: {
          brandCategories: {
            include: {
              category: true,
            },
          },
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBrandById(id: string) {
    try {
      const brand = await prisma.brand.findUnique({
        where: {
          id,
        },
      });

      if (!brand) return throwNotFoundError("Product not found");

      return brand;
    } catch (error) {
      handleServiceError(error);
    }
  }

  // common.brand.service.ts
  async getBrandsByCategorySeoName(categorySeoName: string) {
    try {
      const category =
        await CommonCategoryService.getCategoryByseoName(categorySeoName);

      const brands = await prisma.brand.findMany({
        where: {
          brandCategories: {
            some: {
              categoryId: category!.id,
              status: "ACTIVE",
            },
          },
        },
        orderBy: {
          brandCategories: {
            _count: "asc",
          },
        },
      });

      if (!brands || brands.length === 0) {
        throwNotFoundError("No brands found for this category"); // ← proper error
      }

      return brands;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBrandsByCateoryId(categoryId: string) {
    try {
      const brands = await prisma.brand.findMany({
        where: {
          brandCategories: {
            some: {
              categoryId: categoryId,
              status: "ACTIVE",
            },
          },
        },
        orderBy: {
          brandCategories: {
            _count: "asc",
          },
        },
      });

      if (!brands || brands.length === 0) {
        throwNotFoundError("No brands found for this category"); // ← proper error
      }

      return brands;
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new CommonBrandService();
