"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../category-page/ProductCard";
import { toProductCard } from "../../lib/utlils/toProductCard";
import { getFilteredBuyingProductsClient } from "../../lib/data/buyingProduct.data";
import type { BuyingProductCard } from "../../lib/types/buying/buyingProduct.types";

interface Props {
  categorySlug?: string;
  initialItems: BuyingProductCard[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}

const PAGE_SIZE = 10;

function buildFilterFromParams(
  searchParams: URLSearchParams,
  categorySlug: string | undefined,
  cursor: string | null,
) {
  const toArray = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) ?? undefined;

  return {
    categorySlugs: categorySlug ? [categorySlug] : undefined,
    brands: toArray("brand"),
    storages: toArray("storage"),
    rams: toArray("ram"),
    battery: toArray("battery"),
    screenSizes: toArray("screenSize"),
    warrantyTypes: toArray("warranty"),
    priceMin: searchParams.get("price_min")
      ? Number(searchParams.get("price_min"))
      : undefined,
    priceMax: searchParams.get("price_max")
      ? Number(searchParams.get("price_max"))
      : undefined,
    sort: searchParams.get("sort")?.toUpperCase(),
    cursor,
    limit: PAGE_SIZE,
  };
}

export function ProductGrid({
  categorySlug,
  initialItems,
  initialNextCursor,
  initialHasMore,
}: Props) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filterKey = searchParams.toString();

  useEffect(() => {
    setItems(initialItems);
    setCursor(initialNextCursor);
    setHasMore(initialHasMore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);

    try {
      const filter = buildFilterFromParams(searchParams, categorySlug, cursor);
      const data = await getFilteredBuyingProductsClient(filter);
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, searchParams, categorySlug]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-sm text-gray-400">
        No products match your filters.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-5 lg:gap-6">
        {items.map((item) => (
          <ProductCard key={item.id} product={toProductCard(item)} fullWidth />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center mt-4"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
