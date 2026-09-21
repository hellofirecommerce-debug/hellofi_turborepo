import prisma from "@repo/db";

class UserSeriesService {
  async getSeriesByBrandSeoName(
    brandSeoName: string,
    categorySeoName?: string,
  ) {
    try {
      console.log("getSeriesByBrandSeoName: fetching brand...", brandSeoName);

      const brand = await prisma.brand.findUnique({
        where: { seoName: brandSeoName },
        select: { id: true },
      });

      if (!brand) {
        console.log(
          "getSeriesByBrandSeoName: brand not found for",
          brandSeoName,
        );
        return [];
      }

      const series = await prisma.series.findMany({
        where: {
          brandId: brand.id,
          status: "ACTIVE",
          ...(categorySeoName
            ? { category: { seoName: categorySeoName } }
            : {}),
        },
        orderBy: [{ priority: "asc" }],
      });

      console.log("getSeriesByBrandSeoName: series fetched =", series.length);

      return series;
    } catch (error) {
      console.log("Error fetching series by brand:", error);
      throw error;
    }
  }
}

export default new UserSeriesService();
