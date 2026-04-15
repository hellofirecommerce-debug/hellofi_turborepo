import prisma from "@repo/db";
import { Response, Request } from "express";
import { validateOrThrow } from "../../../lib/utils/validateOrThrow";
import { AdminLoginInput, adminLoginSchema } from "@repo/validations";
import bcrypt from "bcrypt";
import { UserType } from "../../../types";
import {
  handleServiceError,
  throwAuthError,
  throwNotFoundError,
} from "../../../lib/utils/error";
import { GraphQLError } from "graphql/error";
import TokenService from "../common/token.service";
import CookieService from "../common/cookie.service";
import commonAuthService from "../common/common.auth.service";

class AdminAuthService {
  async adminLogin(payload: AdminLoginInput, res: Response) {
    console.log("This is the pyaload", payload);
    const { email, password } = validateOrThrow<AdminLoginInput>(
      adminLoginSchema,
      payload,
    );

    try {
      const admin = await prisma.user.findFirst({
        where: {
          email,
          userType: { in: ["ADMIN", "SUPERADMIN"] },
          status: "ACTIVE",
        },
      });
      if (!admin) return throwNotFoundError("User not found for this email");

      const isValidPassword = await bcrypt.compare(
        password,
        admin.password as string,
      );
      if (!isValidPassword) return throwAuthError("Invalid Password");

      const { accessToken, refreshToken } = TokenService.generateTokens(
        admin.id,
        admin.userType as UserType,
      );

      const session = await prisma.session.create({
        data: {
          userId: admin.id,
          sessionToken: accessToken,
          refreshToken: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          sessionTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      CookieService.setAccessTokenCookie(
        res,
        accessToken,
        admin.userType as UserType,
      );

      CookieService.setRefreshTokenCookie(
        res,
        refreshToken,
        admin.userType as UserType,
      );

      return {
        success: true,
        message: "Login successful",
        sessionId: session.id,
        user: {
          id: admin.id,
          fName: admin.fName,
          lName: admin.lName,
          email: admin.email,
          userType: admin.userType,
          status: admin.status,
        },
      };
    } catch (error) {
      handleServiceError(error);
    }
  }
  requireAdmin(req: Request) {
    if (!req.admin) return throwAuthError("Unauthorized. Admins only.");
    return req.admin;
  }

  async getAdminMe(req: Request) {
    try {
      const adminId = req?.admin?.userId;
      console.log(req?.admin);
      if (!adminId) return throwAuthError("Unauthorized");

      const admin = await prisma.user.findFirst({
        where: {
          id: adminId,
          userType: { in: ["ADMIN", "SUPERADMIN"] },
          status: "ACTIVE",
        },
        select: {
          id: true,
          fName: true,
          lName: true,
          email: true,
          userType: true,
          status: true,
        },
      });

      if (!admin) return throwNotFoundError("Admin not found");
      return admin;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async logout(req: Request, res: Response) {
    return commonAuthService.logout(req, res, UserType.SUPERADMIN);
  }

  async getAndVerifyAdminAccessToken(req: Request) {
    return commonAuthService.getAndVerifyAccessToken(req, UserType.SUPERADMIN);
  }

  async refreshAdminAccessToken(req: Request, res: Response) {
    return commonAuthService.refreshAccessToken(req, res, UserType.SUPERADMIN);
  }
  async createAdmin(payload: {
    fName: string;
    lName: string;
    email: string;
    password: string;
    contact: string;
    pincode: string;
    userType: "ADMIN" | "SUPERADMIN";
  }) {
    try {
      const existing = await prisma.user.findFirst({
        where: { email: payload.email, userType: "SUPERADMIN" },
      });
      if (existing)
        return throwAuthError("Admin already exists with this email");

      const hashedPassword = await bcrypt.hash(payload.password, 10);

      const admin = await prisma.user.create({
        data: {
          fName: payload.fName,
          lName: payload.lName,
          email: payload.email,
          password: hashedPassword,
          contact: payload.contact,
          pincode: payload.pincode,
          userType: payload.userType,
          status: "ACTIVE",
          emailVerified: true,
        },
      });

      return {
        success: true,
        message: "Admin created successfully",
        user: {
          id: admin.id,
          fName: admin.fName,
          lName: admin.lName,
          email: admin.email,
          userType: admin.userType,
          status: admin.status,
        },
      };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminAuthService();
