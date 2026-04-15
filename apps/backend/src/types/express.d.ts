import { UserType, TokenType } from "./index";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        userId: string;
        userType: UserType;
        tokenType: TokenType;
      };
      user?: {
        userId: string;
        userType: UserType;
        tokenType: TokenType;
      };
    }
  }
}
