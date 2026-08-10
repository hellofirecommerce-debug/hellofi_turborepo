import prisma from "@repo/db";
import UserBuyingProductService from "./user.buyingProduct.service";

class UserBrandService {
  async getInStockBrands() {
    try {
      console.log("getInStockBrands: fetching in-stock brand ids...");
      const brandIds = await UserBuyingProductService.getInStockBrandIds();
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
