import AdminSellingProductService from "../../../services/admin/admin.sellingProduct.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Query: {
    getSellingProducts: async (
      _: any,
      args: { filter?: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSellingProductService.getSellingProducts(args.filter);
    },

    getSellingProductById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSellingProductService.getSellingProductById(args.id);
    },
  },

  Mutation: {
    createSellingProduct: async (
      _: any,
      args: any,
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      const { createReadStream, filename } = await args.image;
      const imageBuffer = await streamToBuffer(createReadStream());
      return AdminSellingProductService.createSellingProduct(
        args.input,
        imageBuffer,
        filename,
      );
    },

    updateSellingProduct: async (
      _: any,
      args: any,
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSellingProductService.updateSellingProduct(
        { id: args.id, ...args.input },
        args.image ?? null,
      );
    },

    deleteSellingProduct: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSellingProductService.deleteSellingProduct(args.id);
    },
  },
};
