import AdminCategoryService from "../../../services/admin/admin.category.service";
import CommonCategoryService from "../../../services/common/common.category.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";
export const resolvers = {
  Mutation: {
    createCategory: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      const { createReadStream, filename } = await args.image;
      const imageBuffer = await streamToBuffer(createReadStream());

      return AdminCategoryService.createCategory({
        ...args.input,
        imageBuffer,
        imageFileName: filename,
      });
    },

    updateCategory: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminCategoryService.updateCategory(
        { id: args.id, ...args.input },
        args.image ?? null,
      );
    },

    deleteCategory: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminCategoryService.deleteCategory(args.id);
    },
  },
};
