// components/category-page/ShopByBrand.tsx
import { getInStockBrands } from "../../lib/data/brand.data";
import { ShopByBrandClient } from "./ShopByBrandClient";

export async function ShopByBrand() {
  const brands = await getInStockBrands();

  if (brands.length === 0) return null;

  return <ShopByBrandClient brands={brands} />;
}
