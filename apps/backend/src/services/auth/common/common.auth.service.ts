import prisma from "@repo/db";
import { Request, Response } from "express";
import { UserType } from "../../../types";
import { handleServiceError, throwAuthError } from "../../../lib/utils/error";
import TokenService from "./token.service";
import CookieService from "./cookie.service";

class CommonAuthService {
  async logout(req: Request, res: Response, userType: UserType) {
    try {
      const token = CookieService.getAccessToken(req, userType);
      if (token) {
        await prisma.session.deleteMany({ where: { sessionToken: token } });
      }
      CookieService.clearAuthCookie(res, userType);
      return { message: "Logged out successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getAndVerifyAccessToken(req: Request, userType: UserType) {
    try {
      const accessToken = CookieService.getAccessToken(req, userType);
      if (!accessToken) return throwAuthError("Access token not found");

      const decodedToken = TokenService.verifyAccessToken(
        accessToken,
        userType,
      );
      return {
        userId: decodedToken.userId,
        userType: decodedToken.userType,
        tokenType: decodedToken.tokenType,
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async refreshAccessToken(req: Request, res: Response, userType: UserType) {
    try {
      const refreshToken = CookieService.getRefreshToken(req, userType); // ← use refresh cookie
      if (!refreshToken) return throwAuthError("Refresh token not found");

      const isRefreshExpired = TokenService.isTokenExpired(refreshToken);
      if (isRefreshExpired) {
        CookieService.clearAuthCookie(res, userType);
        return throwAuthError("Session expired. Please login again.");
      }

      const decodedRefresh = TokenService.verifyRefreshToken(
        refreshToken,
        userType,
      );

      const session = await prisma.session.findFirst({
        where: { refreshToken, userId: decodedRefresh.userId }, // ← find by refreshToken
      });

      if (!session) {
        CookieService.clearAuthCookie(res, userType);
        return throwAuthError("Session not found");
      }

      const newAccessToken = TokenService.generateAccessToken(
        decodedRefresh.userId,
        userType,
      );

      await prisma.session.update({
        where: { id: session.id },
        data: {
          sessionToken: newAccessToken,
          sessionTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      CookieService.setAccessTokenCookie(res, newAccessToken, userType);
      CookieService.injectTokenToRequest(req, newAccessToken, userType);
      return { success: true, message: "Token refreshed" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new CommonAuthService();
