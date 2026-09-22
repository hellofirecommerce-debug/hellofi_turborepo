import prisma from "@repo/db";
import UserBuyingProductService from "./user.buyingProduct.service";
import RedisService from "../common/redis.service";

const BRANDS_CACHE_TTL = 60 * 60 * 24; // 1 day, in seconds — matches frontend revalidate

class UserBrandService {
  async getInStockBrands(categorySlug?: string) {
    const cacheKey = `in-stock-brands:${categorySlug ?? "all"}`;

    const cached = await RedisService.get<any[]>(cacheKey);
    if (cached) {
      console.log("getInStockBrands: cache hit for", cacheKey);
      return cached;
    }

    try {
      console.log(
        "getInStockBrands: fetching in-stock brand ids...",
        categorySlug ? `for category ${categorySlug}` : "for all categories",
      );
      const brandIds =
        await UserBuyingProductService.getInStockBrandIds(categorySlug);
      console.log("getInStockBrands: brandIds =", brandIds);

      let brands;

      if (categorySlug) {
        const category = await prisma.category.findUnique({
          where: { seoName: categorySlug },
          select: { id: true },
        });

        if (!category) {
          console.log("getInStockBrands: category not found for", categorySlug);
          await RedisService.set(cacheKey, [], BRANDS_CACHE_TTL);
          return [];
        }

        const brandCategories = await prisma.brandCategory.findMany({
          where: {
            categoryId: category.id,
            brandId: { in: brandIds },
            status: "ACTIVE",
          },
          orderBy: { priority: "asc" },
          include: { brand: true },
        });

        brands = brandCategories.map((bc) => bc.brand);
      } else {
        brands = await prisma.brand.findMany({
          where: { id: { in: brandIds } },
        });
      }

      console.log("getInStockBrands: brands fetched =", brands.length);
      await RedisService.set(cacheKey, brands, BRANDS_CACHE_TTL);
      return brands;
    } catch (error) {
      console.log("Error fetching in-stock brands:", error);
      throw error;
    }
  }
}

export default new UserBrandService();
