// resolvers/user/user.brand.resolver.ts
import UserBrandService from "../../../services/user/user.brand.service";

export const resolvers = {
  Query: {
    getInStockBrands: async (_: any, args: { categorySlug?: string }) => {
      return UserBrandService.getInStockBrands(args.categorySlug);
    },
  },
};
