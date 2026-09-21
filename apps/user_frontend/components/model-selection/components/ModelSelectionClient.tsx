// components/model-selection/ModelSelectionClient.tsx
"use client";

import { useState } from "react";
import { SeriesFilter } from "./SeriesFilter";
import { ModelGrid } from "./ModelGrid";
import type { Series } from "../../../lib/data/series.data";
import type { SellingProduct } from "../../../lib/data/sellingProduct.data";

interface Props {
  brandSlug: string;
  categorySlug: string;
  series: Series[];
  initialItems: SellingProduct[];
  initialHasMore: boolean;
}

export function ModelSelectionClient({
  brandSlug,
  categorySlug,
  series,
  initialItems,
  initialHasMore,
}: Props) {
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  return (
    <div className="mt-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/4">
        <SeriesFilter
          series={series}
          activeSeriesId={activeSeriesId}
          onSelect={setActiveSeriesId}
        />
      </div>
      <div className="w-full lg:w-3/4">
        <ModelGrid
          brandSlug={brandSlug}
          categorySlug={categorySlug}
          initialItems={initialItems}
          initialHasMore={initialHasMore}
          activeSeriesId={activeSeriesId}
        />
      </div>
    </div>
  );
}
