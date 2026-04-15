import AdminInvoiceSettingsService from "../../../services/admin/admin.invoiceSettings.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getInvoiceSettings: async (_: any, __: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.getAllInvoiceSettings();
    },

    getInvoiceSettingsById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.getInvoiceSettingsById(args.id);
    },

    getDefaultInvoiceSettings: async (
      _: any,
      __: any,
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.getDefaultInvoiceSettings();
    },
  },

  Mutation: {
    createInvoiceSettings: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.createInvoiceSettings(args.input);
    },

    updateInvoiceSettings: async (
      _: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.updateInvoiceSettings(args.input);
    },

    deleteInvoiceSettings: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.deleteInvoiceSettings(args.id);
    },

    setDefaultInvoiceSettings: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminInvoiceSettingsService.setDefaultInvoiceSettings(args.id);
    },
  },
};
