import { getInStockBrands } from "../../lib/data/brand.data";
import { ShopByBrandClient } from "./ShopByBrandClient";

interface Props {
  categorySlug?: string;
}

export async function ShopByBrand({ categorySlug }: Props) {
  const brands = await getInStockBrands(categorySlug);

  if (brands.length === 0) return null;

  return <ShopByBrandClient brands={brands} />;
}
