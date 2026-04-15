import CookieService from "../services/auth/common/cookie.service";
import { UserType } from "../types";
import { Request, Response, NextFunction } from "express";
import TokenService from "../services/auth/common/token.service";
import CommonAuthService from "../services/auth/common/common.auth.service";
import AdminAuthService from "../services/auth/admin/admin.auth.service";
import prisma from "@repo/db";

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = CookieService.getAccessToken(req, UserType.SUPERADMIN);
    const refreshToken = CookieService.getRefreshToken(
      req,
      UserType.SUPERADMIN,
    ); // ← add

    // No tokens at all → not logged in
    if (!accessToken && !refreshToken) return next();

    // Access token missing or expired → try refresh
    if (!accessToken || TokenService.isTokenExpired(accessToken)) {
      if (!refreshToken) return next(); // ← can't refresh without refresh token
      await CommonAuthService.refreshAccessToken(req, res, UserType.SUPERADMIN);
    }

    const decoded = await AdminAuthService.getAndVerifyAdminAccessToken(req);
    if (!decoded) return next();

    if (
      decoded.userType !== UserType.ADMIN &&
      decoded.userType !== UserType.SUPERADMIN
    ) {
      return next();
    }

    const currentToken = CookieService.getAccessToken(req, UserType.SUPERADMIN);
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: currentToken,
        userId: decoded.userId,
        expires: { gt: new Date() },
      },
    });

    if (!session) {
      await CommonAuthService.logout(req, res, UserType.SUPERADMIN);
      return next();
    }

    req.admin = decoded;
    return next();
  } catch (error) {
    return next();
  }
};
