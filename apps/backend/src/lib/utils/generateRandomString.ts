import { randomBytes } from "crypto";

export const generateRandomString = (length: number = 8): string => {
  return randomBytes(length).toString("hex").slice(0, length);
};
