import prisma from "@repo/db";
import UserBuyingProductService from "./user.buyingProduct.service";

class UserBrandService {
  async getInStockBrands() {
    try {
      const brandIds = await UserBuyingProductService.getInStockBrandIds();

      return await prisma.brand.findMany({
        where: {
          id: { in: brandIds },
        },
      });
    } catch (error) {
      console.log("Error fetching in-stock brands:", error);
      throw error;
    }
  }
}

export default new UserBrandService();
