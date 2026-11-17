import UserSellingOrderService from "../../../services/user/user.sellingOrder.service";
import UserAuthService from "../../../services/user/user.auth.service";
import { SelectedAnswer } from "../../../services/user/user.pricing.service";

export const resolvers = {
  Mutation: {
    createSellingOrder: async (
      _: any,
      args: {
        input: {
          productId: string;
          variantId?: string | null;
          answers: SelectedAnswer[];
        };
      },
      ctx: { req: any },
    ) => {
      // Require Auth (Throws if not logged in)
      const user = UserAuthService.requireUser(ctx.req);

      return UserSellingOrderService.createSellingOrder({
        userId: user.userId,
        productId: args.input.productId,
        variantId: args.input.variantId,
        answers: args.input.answers,
      });
    },
  },
  Query: {
    getSellingOrder: async (
      _: any,
      args: { orderNo: string },
      ctx: { req: any },
    ) => {
      const user = UserAuthService.requireUser(ctx.req);
      console.log("This is the user:", user.userId);
      console.log("This is the order:", args.orderNo);
      return UserSellingOrderService.getOrderByNo(args.orderNo, user.userId);
    },
  },
};
