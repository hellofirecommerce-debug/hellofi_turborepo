import CommonCategoryService from "../../../services/common/common.category.service";

export const resolvers = {
  Query: {
    getCategories: async () => {
      return CommonCategoryService.getCategories();
    },
    getCategoryById: async (_: any, args: { id: string }) => {
      return CommonCategoryService.getCategoryById(args.id);
    },
  },
};
