import UserBuyingProductService from "../../../services/user/user.buyingProduct.service";

export const resolvers = {
  Query: {
    getBuyingProductsBySection: async (
      _parent: unknown,
      args: { section: string; categorySlug?: string },
    ) => {
      return UserBuyingProductService.getBuyingProductsBySection({
        section: args.section as any,
        categorySlug: args.categorySlug,
      });
    },

    getAvailableFilters: async (
      _parent: unknown,
      args: { categorySlugs?: string[] },
    ) => {
      return UserBuyingProductService.getAvailableFilters(args.categorySlugs);
    },
    getFilteredBuyingProducts: async (_: any, args: { filter?: any }) => {
      return UserBuyingProductService.getFilteredBuyingProducts(args.filter ?? {});
    },
  },
};
