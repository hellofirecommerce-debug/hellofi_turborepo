import AdminOptionService from "../../../services/admin/admin.option.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Query: {
    getOptions: async (_: any, args: { filter?: any }, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminOptionService.getOptions(args.filter);
    },

    getOptionById: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminOptionService.getOptionById(args.id);
    },
  },

  Mutation: {
    createOption: async (_: any, args: any, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);

      let imageData = null;
      if (args.image) {
        const { createReadStream, filename, mimetype } = await args.image;
        const buffer = await streamToBuffer(createReadStream());
        imageData = { buffer, fileName: filename, mimetype };
      }

      // 👇 Pass args.resize to the service
      return AdminOptionService.createOption(
        args.input,
        imageData,
        args.resize ?? true,
      );
    },

    updateOption: async (_: any, args: any, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);

      let imageData = null;
      if (args.image) {
        const { createReadStream, filename, mimetype } = await args.image;
        const buffer = await streamToBuffer(createReadStream());
        imageData = { buffer, fileName: filename, mimetype };
      }

      // 👇 Pass args.removeImage to the service
      return AdminOptionService.updateOption(
        args.input,
        imageData,
        args.resize ?? true,
        args.removeImage ?? false,
      );
    },

    deleteOption: async (_: any, args: { id: string }, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminOptionService.deleteOption(args.id);
    },
  },
};
