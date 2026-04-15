import CommonBrandService from "../../../services/common/common.brand.service";

export const resolvers = {
  Query: {
    getBrands: async () => {
      return CommonBrandService.getBrands();
    },
    getBrandById: async (_: any, args: { id: string }) => {
      return CommonBrandService.getBrandById(args.id);
    },

    getBrandsByCategorySeoName: async (
      _: any,
      args: { categorySeoName: string },
    ) => {
      return CommonBrandService.getBrandsByCategorySeoName(
        args.categorySeoName,
      );
    },
    getBrandsByCategoryId: async (_: any, args: { categoryId: string }) => {
      return CommonBrandService.getBrandsByCateoryId(args.categoryId);
    },
  },
};
