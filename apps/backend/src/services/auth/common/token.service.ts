import JWT from "jsonwebtoken";
import {
  TokenPayload,
  TokenPair,
  JWTSecrets,
  TokenType,
  UserType,
  RefreshTokenPayload,
} from "../../../types";
import { throwAuthError } from "../../../lib/utils/error";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "XrvcEk39YioyFadAh7BN";
const ADMIN_JWT_REFRESH_SECRET =
  process.env.ADMIN_JWT_REFRESH_SECRET || "R62Gu4PWDEAKjz04FhLF";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "novrPptH9NhfzZ0Sa84Z";
const USER_JWT_REFRESH_SECRET =
  process.env.USER_JWT_REFRESH_SECRET || "VrKlvtjlVtL4yLhHQPZd";

class TokenService {
  private static instance: TokenService;

  private constructor() {} // ← Private constructor

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  private getSecrets(userType: UserType): JWTSecrets {
    const isAdmin = [UserType.ADMIN, UserType.SUPERADMIN].includes(userType);
    return {
      accessSecret: isAdmin ? ADMIN_JWT_SECRET : USER_JWT_SECRET,
      refreshSecret: isAdmin
        ? ADMIN_JWT_REFRESH_SECRET
        : USER_JWT_REFRESH_SECRET,
    };
  }

  generateAccessToken(userId: string, userType: UserType): string {
    const { accessSecret } = this.getSecrets(userType);

    const accessToken = JWT.sign(
      {
        userId,
        userType,
        tokenType: TokenType.ACCESS, // ← Use enum
      } as TokenPayload,
      accessSecret,
      { expiresIn: "1h" },
    );

    return accessToken;
  }

  generateRefreshToken(userId: string, userType: UserType): string {
    const { refreshSecret } = this.getSecrets(userType);

    const refreshToken = JWT.sign(
      {
        userId,
        userType,
        tokenType: TokenType.REFRESH, // ← Use enum
      } as RefreshTokenPayload,
      refreshSecret,
      { expiresIn: "7d" },
    );

    return refreshToken;
  }

  generateTokens(userId: string, userType: UserType): TokenPair {
    const accessToken = this.generateAccessToken(userId, userType);
    const refreshToken = this.generateRefreshToken(userId, userType);
    return { accessToken, refreshToken };
  }

  decodeToken(token: string): TokenPayload {
    return JWT.decode(token) as TokenPayload;
  }
  isTokenExpired(token: string): boolean {
    const decoded = JWT.decode(token) as { exp: number };
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
  }

  verifyAccessToken(token: string, userType: UserType): TokenPayload {
    const { accessSecret } = this.getSecrets(userType);
    const decoded = JWT.verify(token, accessSecret) as TokenPayload;
    if (decoded.tokenType !== TokenType.ACCESS) {
      throwAuthError("Invalid Token Type");
    }
    return decoded;
  }

  verifyRefreshToken(token: string, userType: UserType): RefreshTokenPayload {
    const { refreshSecret } = this.getSecrets(userType);
    const decoded = JWT.verify(token, refreshSecret) as RefreshTokenPayload;
    if (decoded.tokenType !== TokenType.REFRESH) {
      throwAuthError("Invalid Token Type");
    }
    return decoded;
  }
}

export default TokenService.getInstance();
