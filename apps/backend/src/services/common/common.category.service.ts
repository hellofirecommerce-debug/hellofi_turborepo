import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import RedisService from "./redis.service";

const CACHE_TTL = 60 * 60; // 1 hour

class CommonCategoryService {
  async getCategories() {
    try {
      const cacheKey = "categories:all";

      const cached = await RedisService.get<any[]>(cacheKey);
      if (cached) {
        console.log("✅ Categories served from cache");
        return cached;
      }

      const categories = await prisma.category.findMany({
        orderBy: { priority: "asc" },
      });

      await RedisService.set(cacheKey, categories, CACHE_TTL);
      console.log("✅ Categories cached");

      return categories;
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

  async getCategoryByseoName(seoName: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { seoName },
      });
      if (!category) throwNotFoundError("Category Not Found");
      return category!;
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new CommonCategoryService();
