import { randomBytes } from "crypto";

export function generateSKU(productName: string, variantIndex: number): string {
  const prefix = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-V${variantIndex + 1}-${suffix}`;
}
