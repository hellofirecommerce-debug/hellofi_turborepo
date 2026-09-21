import prisma from "@repo/db";

class UserSellingProductService {
  async getSellingProductsByBrand(
    brandSeoName: string,
    categorySeoName: string,
    skip: number = 0,
    take: number = 10,
  ) {
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
        return { items: [], hasMore: false };
      }

      const where = {
        brandId: brand.id,
        categoryId: category.id,
        status: "ACTIVE" as const,
        series: { status: "ACTIVE" as const },
      };

      // Fetch one extra to know if there's a next page
      const items = await prisma.sellingProduct.findMany({
        where,
        orderBy: [{ series: { priority: "asc" } }, { releasedYear: "desc" }],
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

      console.log(
        "getSellingProductsByBrand: returning",
        page.length,
        "items, hasMore =",
        hasMore,
      );

      return { items: page, hasMore };
    } catch (error) {
      console.log("Error fetching selling products by brand:", error);
      throw error;
    }
  }
}

export default new UserSellingProductService();
