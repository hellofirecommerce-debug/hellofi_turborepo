import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";

class CommonCategoryService {
  async getCategories() {
    try {
      return await prisma.category.findMany({
        orderBy: { priority: "asc" },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      if (!category) return throwNotFoundError("Category not found");
      return category;
    } catch (error) {
      handleServiceError(error);
    }
  }

  // common.category.service.ts
  async getCategoryByseoName(seoName: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { seoName },
      });
      if (!category) throwNotFoundError("Category Not Found"); // ← remove return
      return category!; // ← non-null assertion since throwNotFoundError throws
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new CommonCategoryService();
