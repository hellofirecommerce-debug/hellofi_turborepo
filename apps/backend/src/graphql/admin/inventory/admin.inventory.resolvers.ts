import AdminInventoryService from "../../../services/admin/admin.inventory.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getInventoryProducts: async (
      _: any,
      args: { filter?: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.getInventoryProducts(args.filter);
    },

    getInventoryProductById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.getInventoryProductById(args.id);
    },

    getInventoryProductByOrderId: async (
      _: any,
      args: { orderId: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.getInventoryProductByOrderId(args.orderId);
    },

    getInventoryProductByImei: async (
      _: any,
      args: { imeiOrSerial: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.getInventoryProductByImei(args.imeiOrSerial);
    },
  },

  Mutation: {
    createInventoryProduct: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.createInventoryProduct(args.input);
    },

    updateInventoryProduct: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.updateInventoryProduct(args.input);
    },

    markInventoryProductAsSold: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.markAsSold(args.input);
    },

    deleteInventoryProduct: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.deleteInventoryProduct(args.id);
    },
  },
};
