import prisma from "@repo/db";
import RedisService from "../common/redis.service"; // adjust path to your actual file

const SELLING_PRODUCTS_CACHE_TTL = 60 * 60 * 6; // 6 hours, in seconds

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
      console.log("getSellingProductsByBrand: fetching page", {
        brandSeoName,
        categorySeoName,
        skip,
        take,
      });

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
        console.log("getSellingProductsByBrand: brand or category not found");
        const empty = { items: [], hasMore: false };
        await RedisService.set(cacheKey, empty, SELLING_PRODUCTS_CACHE_TTL);
        return empty;
      }

      const where = {
        brandId: brand.id,
        categoryId: category.id,
        status: "ACTIVE" as const,
        series: { status: "ACTIVE" as const },
      };

      const items = await prisma.sellingProduct.findMany({
        where,
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

      console.log(
        "getSellingProductsByBrand: returning",
        page.length,
        "items, hasMore =",
        hasMore,
      );

      await RedisService.set(cacheKey, result, SELLING_PRODUCTS_CACHE_TTL);
      return result;
    } catch (error) {
      console.log("Error fetching selling products by brand:", error);
      throw error;
    }
  }
}

export default new UserSellingProductService();
