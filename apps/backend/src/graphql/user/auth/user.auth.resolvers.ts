import UserAuthService from "../../../services/user/user.auth.service";
import CommonAuthService from "../../../services/auth/common/common.auth.service";
import { UserType } from "../../../types";

export const resolvers = {
  Query: {
    getUserMe: async (_: any, __: any, ctx: { req: any }) => {
      return UserAuthService.getMe(ctx.req);
    },
  },
  Mutation: {
    // Registered users only. Unregistered → { needsRegistration: true }
    sendUserOTP: async (_: any, args: { contact: string }) => {
      return UserAuthService.sendOTP(args.contact);
    },

    // New users: register, then send the OTP
    registerAndSendUserOTP: async (
      _: any,
      args: {
        firstName: string;
        lastName: string;
        contact: string;
        pinCode: string;
      },
    ) => {
      return UserAuthService.registerAndSendOTP(
        args.firstName,
        args.lastName,
        args.contact,
        args.pinCode,
      );
    },

    resendUserOTP: async (_: any, args: { contact: string }) => {
      return UserAuthService.resendOTP(args.contact);
    },

    verifyUserOTP: async (
      _: any,
      args: { input: { contact: string; otp: string } },
      ctx: { req: any; res: any },
    ) => {
      return UserAuthService.verifyOtp(
        args.input.contact,
        args.input.otp,
        ctx.req,
        ctx.res,
      );
    },

    userLogout: async (_: any, __: any, ctx: { req: any; res: any }) => {
      return CommonAuthService.logout(ctx.req, ctx.res, UserType.USER);
    },
  },
};
