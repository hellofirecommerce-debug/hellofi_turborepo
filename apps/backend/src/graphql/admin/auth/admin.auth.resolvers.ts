import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { AdminLoginInput } from "@repo/validations";
import { GraphQLContext } from "../../../types";

// admin.auth.resolvers.ts
export const resolvers = {
  Query: {
    adminMe: async (_parent: any, _args: any, context: GraphQLContext) => {
      return AdminAuthService.getAdminMe(context.req);
    },
  },
  Mutation: {
    adminUserLogin: async (
      _parent: any,
      args: { payload: AdminLoginInput },
      context: GraphQLContext,
    ) => {
      return AdminAuthService.adminLogin(args.payload, context.res);
    },
    createAdmin: async (
      _parent: any,
      args: { payload: any },
      context: GraphQLContext,
    ) => {
      return AdminAuthService.createAdmin(args.payload);
    },
    adminLogout: async (_parent: any, _args: any, context: GraphQLContext) => {
      return AdminAuthService.logout(context.req, context.res);
    },
  },
};
