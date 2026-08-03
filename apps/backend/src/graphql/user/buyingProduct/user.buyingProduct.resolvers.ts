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
  },
};
