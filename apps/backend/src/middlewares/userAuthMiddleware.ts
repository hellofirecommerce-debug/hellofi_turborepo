import { Request, Response, NextFunction } from "express";
import prisma from "@repo/db";
import CookieService from "../services/auth/common/cookie.service";
import TokenService from "../services/auth/common/token.service";
import CommonAuthService from "../services/auth/common/common.auth.service";
import { UserType } from "../types";

export const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = CookieService.getAccessToken(req, UserType.USER);
    const refreshToken = CookieService.getRefreshToken(req, UserType.USER);

    // No tokens at all → not logged in
    if (!accessToken && !refreshToken) return next();

    // Access token missing or expired → try refresh
    if (!accessToken || TokenService.isTokenExpired(accessToken)) {
      if (!refreshToken) return next(); // can't refresh without a refresh token
      await CommonAuthService.refreshAccessToken(req, res, UserType.USER);
    }

    // Read the (possibly refreshed) token and verify it
    const currentToken = CookieService.getAccessToken(req, UserType.USER);
    if (!currentToken) return next();

    // verify() throws if the signature is wrong or the token expired;
    // the catch below turns that into "not logged in"
    const decoded = TokenService.verifyAccessToken(currentToken, UserType.USER);
    if (!decoded) return next();

    if (decoded.userType !== UserType.USER) return next();

    // Session must exist in DB and not be expired
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: currentToken,
        userId: decoded.userId,
        expires: { gt: new Date() },
      },
    });

    if (!session) {
      await CommonAuthService.logout(req, res, UserType.USER);
      return next();
    }

    req.user = decoded; // { userId, userType } → used by getMe / requireUser
    return next();
  } catch (error) {
    return next();
  }
};
