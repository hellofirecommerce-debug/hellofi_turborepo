// components/category-page/TopSellingLaptopsSection.tsx
"use client";
import { useQuery } from "@apollo/client/react";
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { GET_BUYING_PRODUCTS_BY_SECTION } from "../../lib/graphql/queires/buyingProduct.queries";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import {
  toProduct,
  type GetBuyingProductsBySectionData,
  type GetBuyingProductsBySectionVars,
} from "../../lib/types/buying/buyingProduct.types";

interface Props {
  categorySlug?: string;
}

export function TopSellingLaptopsSection({ categorySlug = "laptop" }: Props) {
  const { data, loading } = useQuery<
    GetBuyingProductsBySectionData,
    GetBuyingProductsBySectionVars
  >(GET_BUYING_PRODUCTS_BY_SECTION, {
    variables: { section: "TOP_SELLING", categorySlug },
  });

  if (loading || !data?.getBuyingProductsBySection?.length) return null;

  const products: Product[] = data.getBuyingProductsBySection.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Top Selling Laptops"
      badgeText="Hot Deals"
      seeAllHref="/buy-used-laptops"
      products={products}
    />
  );
}
