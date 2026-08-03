// lib/utils/calculateDiscount.ts

export function calculateDiscount(mrp: number, price: number) {
  if (!mrp || mrp <= price) {
    return { discountPercent: 0, savings: 0 };
  }
  const savings = mrp - price;
  const discountPercent = Math.round((savings / mrp) * 100);
  return { discountPercent, savings };
}
