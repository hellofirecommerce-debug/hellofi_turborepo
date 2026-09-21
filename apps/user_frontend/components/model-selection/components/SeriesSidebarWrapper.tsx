// components/model-selection/SeriesSidebarWrapper.tsx
"use client";

import { useState } from "react";
import { SeriesSidebar } from "./SeriesSidebar";
import type { Series } from "../../../lib/data/series.data";
interface Props {
  series: Series[];
}

export function SeriesSidebarWrapper({ series }: Props) {
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  return (
    <SeriesSidebar
      series={series}
      activeSeriesId={activeSeriesId}
      onSelect={setActiveSeriesId}
    />
  );
}
