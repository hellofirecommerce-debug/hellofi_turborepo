import AdminInventoryService from "../../../services/admin/admin.inventory.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

// reads a list of GraphQL Uploads into [{ buffer, fileName, mimetype }]
const readUploads = async (uploads?: any[] | null) => {
  if (!uploads || uploads.length === 0) return [];
  return Promise.all(
    uploads.map(async (upload) => {
      const { createReadStream, filename, mimetype } = await upload;
      const buffer = await streamToBuffer(createReadStream());
      return {
        buffer,
        fileName: filename as string,
        mimetype: mimetype as string,
      };
    }),
  );
};

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
    searchProductNames: async (
      _: any,
      args: {
        query: string;
        categoryId?: string;
        brandId?: string;
        page?: number;
      },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.searchProductNames(
        args.query,
        args.categoryId,
        args.brandId,
        args.page,
      );
    },

    getAvailableForInvoice: async (_: any, args: any, context: any) => {
      return AdminInventoryService.getAvailableForInvoice({
        search: args.search,
        brandId: args.brandId,
        categoryId: args.categoryId,
        page: args.page,
        pageSize: args.pageSize,
      });
    },

    getInventoryProductForInvoice: async (_: any, args: any, context: any) => {
      return AdminInventoryService.getInventoryProductForInvoice(
        args.imeiOrSerial,
      );
    },
  },

  Mutation: {
    createInventoryProduct: async (
      _: any,
      args: { input: any; originalBills?: any[] },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      const files = await readUploads(args.originalBills);
      return AdminInventoryService.createInventoryProduct(args.input, files);
    },

    updateInventoryProduct: async (
      _: any,
      args: {
        input: any;
        originalBills?: any[];
        removeOriginalBillIds?: string[];
      },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      const files = await readUploads(args.originalBills);
      return AdminInventoryService.updateInventoryProduct(
        args.input,
        files,
        args.removeOriginalBillIds ?? [],
      );
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

    deleteInventoryProducts: async (
      _: any,
      args: { ids: string[] },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInventoryService.deleteInventoryProducts(args.ids);
    },
  },
};
