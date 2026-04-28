import AdminSeriesService from "../../../services/admin/admin.series.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getSeries: async (
      _: any,
      args: { filter?: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSeriesService.getSeries(args.filter);
    },

    getSeriesById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSeriesService.getSeriesById(args.id);
    },
  },

  Mutation: {
    createSeries: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSeriesService.createSeries(args.input);
    },

    updateSeries: async (
      _: any,
      args: { id: string; input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSeriesService.updateSeries({ id: args.id, ...args.input });
    },

    deleteSeries: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminSeriesService.deleteSeries(args.id);
    },
  },
};
