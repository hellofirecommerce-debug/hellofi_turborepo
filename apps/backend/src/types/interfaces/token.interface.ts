import { UserType, TokenType } from "../enums";

export interface TokenPayload {
  userId: string;
  userType: UserType;
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  userType: UserType;
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JWTSecrets {
  accessSecret: string;
  refreshSecret: string;
}
