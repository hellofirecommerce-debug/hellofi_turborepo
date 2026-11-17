import AdminSellingOrderService, {
  type AdminOrderFilter,
} from "../../../services/admin/admin.sellingOrder.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    adminSellingOrders: async (
      _: any,
      args: { filter?: AdminOrderFilter },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminSellingOrderService.list(args.filter ?? {});
    },

    adminOrderTimeline: async (
      _: any,
      args: { orderNo: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminSellingOrderService.timelineState(args.orderNo);
    },

    adminOrderCities: async (_: any, __: any, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminSellingOrderService.cities();
    },
  },

  Mutation: {
    adminUpdateOrderTimelineStatus: async (
      _: any,
      args: { orderNo: string; status: string; message?: string | null },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminSellingOrderService.updateTimelineStatus(
        args.orderNo,
        args.status,
        args.message,
      );
    },
  },
};
