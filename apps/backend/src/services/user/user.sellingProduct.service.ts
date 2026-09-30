import prisma from "@repo/db";
import RedisService from "../common/redis.service";
import {
  handleServiceError,
  throwNotFoundError,
  throwServerError,
} from "../../lib/utils/error";

const SELLING_PRODUCTS_CACHE_TTL = 60 * 60 * 6; // 6 hours

class UserSellingProductService {
  async getSellingProductsByBrand(
    brandSeoName: string,
    categorySeoName: string,
    skip: number = 0,
    take: number = 10,
  ) {
    const cacheKey = `selling-products:${brandSeoName}:${categorySeoName}:${skip}:${take}`;

    const cached = await RedisService.get<{ items: any[]; hasMore: boolean }>(
      cacheKey,
    );
    if (cached) {
      console.log("getSellingProductsByBrand: cache hit for", cacheKey);
      return cached;
    }

    try {
      const [brand, category] = await Promise.all([
        prisma.brand.findUnique({
          where: { seoName: brandSeoName },
          select: { id: true },
        }),
        prisma.category.findUnique({
          where: { seoName: categorySeoName },
          select: { id: true },
        }),
      ]);

      if (!brand || !category) {
        return throwNotFoundError("Brand or category not found");
      }

      const items = await prisma.sellingProduct.findMany({
        where: {
          brandId: brand.id,
          categoryId: category.id,
          status: "ACTIVE",
          series: { status: "ACTIVE" },
        },
        orderBy: [
          { series: { priority: "asc" } },
          { launchedDate: "desc" },
          { id: "asc" },
        ],
        include: {
          series: {
            select: { id: true, seriesName: true, priority: true },
          },
        },
        skip,
        take: take + 1,
      });

      const hasMore = items.length > take;
      const page = hasMore ? items.slice(0, take) : items;
      const result = { items: page, hasMore };

      await RedisService.set(cacheKey, result, SELLING_PRODUCTS_CACHE_TTL);
      return result;
    } catch (error) {
      console.log("Error Fetching selling Products:", error);
      return handleServiceError(error);
    }
  }

  async getSellingProductBySeoName(seoName: string) {
    if (!seoName) {
      return throwServerError("Product seoName was not provided to the query");
    }

    const cacheKey = `selling-product:${seoName}`;
    const cached = await RedisService.get<any>(cacheKey);
    if (cached) {
      console.log("getSellingProductBySeoName: cache hit for", cacheKey);
      return cached;
    }

    try {
      const product = await prisma.sellingProduct.findUnique({
        where: { productSeoName: seoName, status: "ACTIVE" },
        include: {
          brand: { select: { id: true, name: true, seoName: true } },
          variants: {
            where: { status: "ACTIVE" },
            orderBy: { productPrice: "asc" },
          },
        },
      });

      if (!product) {
        return throwNotFoundError(
          `Product with seoName "${seoName}" not found`,
        );
      }

      await RedisService.set(cacheKey, product, SELLING_PRODUCTS_CACHE_TTL);
      return product;
    } catch (error) {
      console.log("Error fetching Selling Product by seoname:", error);
      return handleServiceError(error);
    }
  }
}

export default new UserSellingProductService();
