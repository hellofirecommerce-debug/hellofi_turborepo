import prisma from "@repo/db";
import UserBuyingProductService from "./user.buyingProduct.service";

class UserBrandService {
  async getInStockBrands(categorySlug?: string) {
    try {
      console.log(
        "getInStockBrands: fetching in-stock brand ids...",
        categorySlug ? `for category ${categorySlug}` : "for all categories",
      );
      const brandIds =
        await UserBuyingProductService.getInStockBrandIds(categorySlug);
      console.log("getInStockBrands: brandIds =", brandIds);

      const brands = await prisma.brand.findMany({
        where: {
          id: { in: brandIds },
        },
      });
      console.log("getInStockBrands: brands fetched =", brands.length);

      return brands;
    } catch (error) {
      console.log("Error fetching in-stock brands:", error);
      throw error;
    }
  }
}

export default new UserBrandService();
