import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import CommonCategoryService from "./common.category.service";
import RedisService from "./redis.service";

const CACHE_TTL = 60 * 60; // 1 hour

class CommonBrandService {
  async getBrands() {
    try {
      const cacheKey = "brands:all";

      const cached = await RedisService.get<any[]>(cacheKey);
      if (cached) {
        console.log("✅ Brands served from cache");
        return cached;
      }

      const brands = await prisma.brand.findMany({
        include: {
          brandCategories: {
            include: { category: true },
          },
        },
      });

      await RedisService.set(cacheKey, brands, CACHE_TTL);
      console.log("✅ Brands cached");

      return brands;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBrandById(id: string) {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!brand) return throwNotFoundError("Brand not found");

      return brand;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBrandsByCategorySeoName(categorySeoName: string) {
    try {
      const category =
        await CommonCategoryService.getCategoryByseoName(categorySeoName);

      const cacheKey = `brands:category:${category!.id}`;

      const cached = await RedisService.get<any[]>(cacheKey);
      if (cached) {
        console.log("✅ Brands by seoName served from cache:", categorySeoName);
        return cached;
      }

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
        throwNotFoundError("No brands found for this category");
      }

      await RedisService.set(cacheKey, brands, CACHE_TTL);
      console.log("✅ Brands by seoName cached:", categorySeoName);

      return brands;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBrandsByCateoryId(categoryId: string) {
    try {
      const cacheKey = `brands:category:${categoryId}`;

      const cached = await RedisService.get<any[]>(cacheKey);
      if (cached) {
        console.log("✅ Brands by categoryId served from cache:", categoryId);
        return cached;
      }

      const brands = await prisma.brand.findMany({
        where: {
          brandCategories: {
            some: {
              categoryId,
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
        throwNotFoundError("No brands found for this category");
      }

      await RedisService.set(cacheKey, brands, CACHE_TTL);
      console.log("✅ Brands by categoryId cached:", categoryId);

      return brands;
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new CommonBrandService();
