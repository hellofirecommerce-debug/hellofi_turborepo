import UserAuthService from "../../../services/user/user.auth.service";
import UserAddressService from "../../../services/user/user.address.service";
import UserCheckoutService from "../../../services/user/user.checkout.service";

const authUser = (ctx: any) => UserAuthService.requireUser(ctx.req);

export const resolvers = {
  Query: {
    getMyAddresses: async (_: unknown, __: unknown, ctx: any) => {
      const user = authUser(ctx);
      return UserAddressService.list(user.userId);
    },
    checkPincode: async (
      _: unknown,
      { pinCode }: { pinCode: string },
      ctx: any,
    ) => {
      authUser(ctx);
      return UserCheckoutService.checkPincode(pinCode);
    },
  },

  Mutation: {
    createAddress: async (_: unknown, { input }: any, ctx: any) => {
      const user = authUser(ctx);
      return UserAddressService.create(user.userId, input);
    },
    updateAddress: async (_: unknown, { id, input }: any, ctx: any) => {
      const user = authUser(ctx);
      return UserAddressService.update(user.userId, id, input);
    },
    deleteAddress: async (_: unknown, { id }: any, ctx: any) => {
      const user = authUser(ctx);
      return UserAddressService.remove(user.userId, id);
    },

    placeSellingOrder: async (
      _: unknown,
      { orderNo, input }: any,
      ctx: any,
    ) => {
      const user = authUser(ctx);
      return UserCheckoutService.placeOrder(user.userId, orderNo, input);
    },
  },
};
