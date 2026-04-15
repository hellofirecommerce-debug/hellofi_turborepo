import { SameSite } from "../enums";

export interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure: boolean;
  sameSite: SameSite;
  path?: string;
  domain?: string;
}
