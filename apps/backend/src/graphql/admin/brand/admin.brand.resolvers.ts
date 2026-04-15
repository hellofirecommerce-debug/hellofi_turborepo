import AdminBrandService from "../../../services/admin/admin.brand.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Mutation: {
    createBrand: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      try {
        const { createReadStream, filename } = await args.image;
        const imageBuffer = await streamToBuffer(createReadStream());
        const result = await AdminBrandService.createBrand({
          ...args.input,
          imageFileName: filename,
          imageBuffer,
        });
        console.log("createBrand result:", result); // ← log result
        return result;
      } catch (error) {
        console.error("createBrand resolver error:", error); // ← log full error
        throw error;
      }
    },

    updateBrand: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      let imageBuffer = null;
      let imageFileName = null;

      if (args.image) {
        const { createReadStream, filename } = await args.image;
        imageBuffer = await streamToBuffer(createReadStream());
        imageFileName = filename;
      }

      return AdminBrandService.updateBrand(
        { id: args.id, ...args.input },
        imageBuffer && imageFileName
          ? { buffer: imageBuffer, fileName: imageFileName }
          : null,
      );
    },

    updateBrandImage: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      const { createReadStream, filename } = await args.image;
      const imageBuffer = await streamToBuffer(createReadStream());
      return AdminBrandService.updateBrandImage(args.id, imageBuffer, filename);
    },
    deleteBrand: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBrandService.deleteBrand(args.id);
    },

    addBrandToCategory: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBrandService.addBrandToCategory(args.input);
    },
    updateBrandCategory: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBrandService.updateBrandCategory(args.id, args.input);
    },

    removeBrandFromCategory: async (
      _: any,
      args: { brandId: string; categoryId: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBrandService.removeBrandFromCategory(
        args.brandId,
        args.categoryId,
      );
    },
  },
};
