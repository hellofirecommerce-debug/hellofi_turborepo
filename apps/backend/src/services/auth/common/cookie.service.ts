import { CookieOptions, SameSite } from "../../../types";
import { Response, Request } from "express";
import { UserType } from "../../../types";

class CookieService {
  // private readonly ACCESS_TOKEN_COOKIE = "access_token";
  private readonly ADMIN_ACCESS_TOKEN_COOKIE = "admin_access_token";
  private readonly USER_ACCESS_TOKEN_COOKIE = "user_access_token";
  private readonly ADMIN_REFRESH_TOKEN_COOKIE = "admin_refresh_token";
  private readonly USER_REFRESH_TOKEN_COOKIE = "user_refresh_token";
  // private readonly SESSION_ID_COOKIE = "session_id";

  private readonly defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: SameSite.LAX,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".hellofi.in" : "localhost",
  };

  private getAccessTokenKey(userType: UserType): string {
    return [UserType.ADMIN, UserType.SUPERADMIN].includes(userType)
      ? this.ADMIN_ACCESS_TOKEN_COOKIE
      : this.USER_ACCESS_TOKEN_COOKIE;
  }

  private getRefreshTokenKey(userType: UserType): string {
    return [UserType.ADMIN, UserType.SUPERADMIN].includes(userType)
      ? this.ADMIN_REFRESH_TOKEN_COOKIE
      : this.USER_REFRESH_TOKEN_COOKIE;
  }

  // set Access Token Cookie (1 hour)
  setAccessTokenCookie(res: Response, token: string, userType: UserType): void {
    res.cookie(this.getAccessTokenKey(userType), token, {
      ...this.defaultOptions,
      maxAge: 60 * 60 * 1000,
    });
  }
  setRefreshTokenCookie(
    res: Response,
    token: string,
    userType: UserType,
  ): void {
    res.cookie(this.getRefreshTokenKey(userType), token, {
      ...this.defaultOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  getAccessToken(req: Request, userType: UserType): string | undefined {
    return req.cookies?.[this.getAccessTokenKey(userType)];
  }

  getRefreshToken(req: Request, userType: UserType): string | undefined {
    return req.cookies?.[this.getRefreshTokenKey(userType)];
  }

  clearAuthCookie(res: Response, userType: UserType): void {
    res.clearCookie(this.getAccessTokenKey(userType), this.defaultOptions);
    res.clearCookie(this.getRefreshTokenKey(userType), this.defaultOptions); // ← add this
  }
  injectTokenToRequest(req: Request, token: string, userType: UserType): void {
    req.cookies[this.getAccessTokenKey(userType)] = token;
  }
}

export default new CookieService();
