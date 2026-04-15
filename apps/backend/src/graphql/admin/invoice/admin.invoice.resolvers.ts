import AdminInvoiceService from "../../../services/admin/admin.invoice.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getInvoices: async (
      _: any,
      args: { filter?: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.getInvoices(args.filter);
    },

    getInvoiceById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.getInvoiceById(args.id);
    },

    getInvoiceByNumber: async (
      _: any,
      args: { invoiceNumber: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.getInvoiceByNumber(args.invoiceNumber);
    },

    getNextInvoiceNumber: async (_: any, __: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.getNextInvoiceNumber();
    },
  },

  Mutation: {
    createInvoice: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.createInvoice(args.input);
    },

    updateInvoice: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.updateInvoice(args.input);
    },

    finalizeInvoice: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.finalizeInvoice(args.id);
    },

    cancelInvoice: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceService.cancelInvoice(args.id);
    },
  },
};
