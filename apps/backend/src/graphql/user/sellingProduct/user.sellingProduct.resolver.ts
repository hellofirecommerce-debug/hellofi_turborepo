import UserSellingProductService from "../../../services/user/user.sellingProduct.service";

export const resolvers = {
  Query: {
    getSellingProductsByBrand: async (
      _: any,
      args: {
        brandSeoName: string;
        categorySeoName: string;
        skip?: number;
        take?: number;
      },
    ) => {
      return UserSellingProductService.getSellingProductsByBrand(
        args.brandSeoName,
        args.categorySeoName,
        args.skip ?? 0,
        args.take ?? 10,
      );
    },

    getSellingProductBySeoName: async (_: any, args: { seoName: string }) => {
      return UserSellingProductService.getSellingProductBySeoName(args.seoName);
    },
  },
};
