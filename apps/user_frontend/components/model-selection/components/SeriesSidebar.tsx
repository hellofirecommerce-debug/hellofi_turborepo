// components/model-selection/SeriesSidebar.tsx
"use client";

import type { Series } from "../../../lib/data/series.data";

interface Props {
  series: Series[];
  activeSeriesId: string | null;
  onSelect: (seriesId: string | null) => void;
}

export function SeriesSidebar({ series, activeSeriesId, onSelect }: Props) {
  return (
    <aside className="w-full">
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            iPhone Models
          </p>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto">
          <li>
            <button
              onClick={() => onSelect(null)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                activeSeriesId === null
                  ? "bg-blue-50 text-[#0066FF] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
          </li>
          {series.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onSelect(s.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeSeriesId === s.id
                    ? "bg-blue-50 text-[#0066FF] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {s.seriesName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
