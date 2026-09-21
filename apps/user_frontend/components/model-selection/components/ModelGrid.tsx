// components/model-selection/ModelGrid.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  getSellingProductsByBrand,
  type SellingProduct,
} from "../../../lib/data/sellingProduct.data";

interface Props {
  brandSlug: string;
  categorySlug: string;
  initialItems: SellingProduct[];
  initialHasMore: boolean;
  activeSeriesId: string | null;
}

export function ModelGrid({
  brandSlug,
  categorySlug,
  initialItems,
  initialHasMore,
  activeSeriesId,
}: Props) {
  const [items, setItems] = useState<SellingProduct[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false); // guards against double-fire, sync (not state)

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);

    const page = await getSellingProductsByBrand(
      brandSlug,
      categorySlug,
      items.length,
      10,
    );

    setItems((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newItems = page.items.filter((p) => !existingIds.has(p.id));
      return [...prev, ...newItems];
    });
    setHasMore(page.hasMore);
    setLoading(false);
    isFetchingRef.current = false;
  }, [brandSlug, categorySlug, items.length, hasMore]);

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

  let filtered = query
    ? items.filter((p) =>
        p.productName.toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  if (activeSeriesId) {
    filtered = filtered.filter((p) => p.series.id === activeSeriesId);
  }

  const sections: { seriesName: string; products: SellingProduct[] }[] = [];
  for (const product of filtered) {
    const last = sections[sections.length - 1];
    if (last && last.seriesName === product.series.seriesName) {
      last.products.push(product);
    } else {
      sections.push({
        seriesName: product.series.seriesName,
        products: [product],
      });
    }
  }

  return (
    <div className="w-full">
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iPhone model..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
        />
      </div>

      {sections.map((section) => (
        <div key={section.seriesName} className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            {section.seriesName}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {section.products.map((product) => (
              <button
                key={product.id}
                className="rounded-xl border border-gray-200 hover:border-[#0066FF] transition-colors p-2 sm:p-3 text-left"
              >
                <div className="relative w-full aspect-square rounded-lg bg-gray-50 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.image}`}
                    alt={product.productName}
                    fill
                    className="object-contain p-2"
                    sizes="150px"
                  />
                </div>
                <p className="mt-2 text-[11px] sm:text-sm font-medium text-gray-800 text-center leading-snug">
                  {product.productName}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div ref={sentinelRef} className="h-4" />

      {loading && (
        <p className="text-center text-xs text-gray-400 py-4">Loading more…</p>
      )}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-gray-400 py-4">No more models</p>
      )}
    </div>
  );
}
