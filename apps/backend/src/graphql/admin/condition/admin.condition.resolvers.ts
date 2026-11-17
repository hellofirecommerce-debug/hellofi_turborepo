import AdminConditionService from "../../../services/admin/admin.condition.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Query: {
    getConditions: async (
      _: any,
      args: { filter?: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminConditionService.getConditions(args.filter);
    },

    getConditionById: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminConditionService.getConditionById(args.id);
    },
  },

  Mutation: {
    createCondition: async (_: any, args: any, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);

      let imageData = null;
      if (args.image) {
        const { createReadStream, filename } = await args.image;
        const buffer = await streamToBuffer(createReadStream());
        imageData = { buffer, fileName: filename };
      }

      return AdminConditionService.createCondition(args.input, imageData);
    },

    updateCondition: async (_: any, args: any, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);

      let imageData = null;
      if (args.image) {
        const { createReadStream, filename } = await args.image;
        const buffer = await streamToBuffer(createReadStream());
        imageData = { buffer, fileName: filename };
      }

      return AdminConditionService.updateCondition(args.input, imageData);
    },

    deleteCondition: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminConditionService.deleteCondition(args.id);
    },
  },
};
